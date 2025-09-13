"use client";

import React, { useState, useEffect, useRef } from 'react';

// Firebase Imports
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile as updateAuthProfile
} from "firebase/auth";
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    onSnapshot, 
    addDoc, 
    query,
    updateDoc,
    Firestore, 
    getFirestore 
} from "firebase/firestore";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "firebase/storage";


import { Home, Info, Menu, X, User, ArrowRight, Swords, Star, ShieldCheck, Music, LogOut, Settings, Camera, ArrowLeft, Ticket, PlusSquare, ClipboardList, Banknote, CircleDollarSign, UserPlus, AlertTriangle, Users } from 'lucide-react';

// --- DEFINIÇÕES DE TIPO ---
type Role = 'Membro' | 'TI' | 'Pastor' | 'Líder';
type Page = 'home' | 'sobre' | 'gincana' | 'login' | 'welcome' | 'perfil' | 'escalaMidia' | 'escalaLouvor' | 'eventos' | 'criacaoEvento' | 'gestaoEventos' | 'financeiro' | 'cadastro' | 'userManagement';

type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: Role;
  photoUrl: string;
  mcoins: number;
};

type NewsItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  imageUrl: string;
};

type EventItem = {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
};

type ActivityScore = { activity: string; score: number; };
type Team = { id: string; name: string; leader: string; members: string[]; scores: ActivityScore[]; };
type IndividualScore = { id: string; name: string; score: number; };

// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyCvTCch4ONnJyi4xCqNP5zEyQTYQjmBgGA",
  authDomain: "moriaapp-8ca1d.firebaseapp.com",
  projectId: "moriaapp-8ca1d",
  storageBucket: "moriaapp-8ca1d.appspot.com",
  messagingSenderId: "753623213789",
  appId: "1:753623213789:web:5201821777472e73e61d34"
};

// --- INICIALIZAÇÃO ÚNICA DO FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- ASSETS ---
const logoUrl = '/logo preta.png'; 

// --- COMPONENTES ---

const ErrorDisplay = ({ message, instructions }: { message: string, instructions?: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-red-100 text-red-800 rounded-2xl border-2 border-red-200 shadow-md">
        <AlertTriangle className="w-16 h-16 mb-4 text-red-500" />
        <h3 className="font-bold text-xl mb-2">{message}</h3>
        {instructions && instructions}
    </div>
);

const BackButton = ({ onClick }: { onClick: () => void }) => ( <button onClick={onClick} className="flex items-center gap-2 font-semibold text-gray-600 hover:text-black transition-colors mb-8"><ArrowLeft size={18} /> Voltar</button> );
const LoadingSpinner = () => ( <div className="min-h-screen flex items-center justify-center bg-[#F5F3EF]"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div></div> );

const LoginPage = ({ navigateTo }: { navigateTo: (page: Page) => void; }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
              setError('Email ou senha incorretos.');
            } else {
              setError('Ocorreu um erro. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F5F3EF] to-[#EAE8E1]">
            <div className="w-full max-w-md mx-auto z-10 animate-fade-in">
                <div className="text-center mb-8"><img src={logoUrl} alt="Logo Igreja Moriá" className="mx-auto h-12 w-auto mb-6"/><h1 className="text-5xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>BEM-VINDO</h1><p className="text-gray-600">Faça login para continuar</p></div>
                <div className="bg-white/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/40">
                    <form onSubmit={handleFormSubmit}>
                        <div className="space-y-6">
                            <div><label className="text-sm font-bold text-gray-700">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seuemail@exemplo.com" className="mt-1 w-full p-3 bg-white/50 border-2 border-transparent focus:border-black/50 rounded-lg outline-none transition duration-300" /></div>
                            <div><label className="text-sm font-bold text-gray-700">Senha</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="mt-1 w-full p-3 bg-white/50 border-2 border-transparent focus:border-black/50 rounded-lg outline-none transition duration-300" /></div>
                        </div>
                        {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-2 rounded-lg">{error}</p>}
                        <div className="mt-8"><button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-500">{loading ? 'Entrando...' : 'Entrar'}</button></div>
                        <div className="text-center mt-6 text-sm"><a href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-gray-700 hover:underline">Esqueceu a senha?</a><span className="mx-2 text-gray-400">|</span><a href="#" onClick={(e) => {e.preventDefault(); navigateTo('cadastro')}} className="font-semibold text-gray-700 hover:underline">Solicitar cadastro</a></div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const RegisterPage = ({ navigateTo }: { navigateTo: (page: Page) => void; }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<Role>('Membro');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const newUserProfile: Omit<UserProfile, 'uid'> = { name, email, role, photoUrl: '', mcoins: 10 };
            await setDoc(doc(db, 'users', user.uid), newUserProfile);
            setSuccess(true);
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') { setError('Este email já está cadastrado.'); } 
            else if (err.code === 'auth/weak-password') { setError('A senha deve ter no mínimo 6 caracteres.'); }
            else { setError('Ocorreu um erro ao criar a conta.'); }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F3EF]">
                <div className="text-center animate-fade-in max-w-md">
                    <ShieldCheck size={64} className="text-green-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>CADASTRO REALIZADO!</h1>
                    <p className="mt-4 text-lg text-gray-700">Sua conta foi criada com sucesso. Agora você já pode fazer login.</p>
                    <button onClick={() => navigateTo('login')} className="mt-8 w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all">Ir para Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F5F3EF] to-[#EAE8E1]">
            <div className="w-full max-w-md mx-auto z-10 animate-fade-in">
                 <div className="text-center mb-8"><img src={logoUrl} alt="Logo Igreja Moriá" className="mx-auto h-12 w-auto mb-6"/><h1 className="text-5xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>CRIAR CONTA</h1><p className="text-gray-600">Preencha seus dados para solicitar o acesso</p></div>
                 <div className="bg-white/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/40">
                    <form onSubmit={handleFormSubmit}>
                        <div className="space-y-4">
                             <div><label className="text-sm font-bold text-gray-700">Nome Completo</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full p-3 bg-white/50 rounded-lg" /></div>
                             <div><label className="text-sm font-bold text-gray-700">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full p-3 bg-white/50 rounded-lg" /></div>
                             <div><label className="text-sm font-bold text-gray-700">Senha</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full p-3 bg-white/50 rounded-lg" /></div>
                             <div>
                                 <label className="text-sm font-bold text-gray-700">Função Desejada</label>
                                 <select value={role} onChange={e => setRole(e.target.value as Role)} className="mt-1 w-full p-3 bg-white/50 rounded-lg">
                                     <option>Membro</option><option>Líder</option><option>Pastor</option><option>TI</option>
                                 </select>
                             </div>
                        </div>
                        {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-2 rounded-lg">{error}</p>}
                        <div className="mt-8"><button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-500">{loading ? 'Criando...' : 'Criar Conta'}</button></div>
                        <div className="text-center mt-6 text-sm"><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('login'); }} className="font-semibold text-gray-700 hover:underline">Já tem uma conta? Faça login</a></div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const UserManagementPage = ({ onBack }: { onBack: () => void; }) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const usersCollection = collection(db, "users");
        const unsubscribe = onSnapshot(query(usersCollection), 
            (snapshot) => {
                const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
                setUsers(usersData);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Erro de permissão ao buscar usuários:", err);
                setError("Você não tem permissão para visualizar os usuários.");
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleRoleChange = async (uid: string, newRole: Role) => {
        const userRef = doc(db, 'users', uid);
        try {
            await updateDoc(userRef, { role: newRole });
            // O onSnapshot atualizará a UI automaticamente
        } catch (error) {
            console.error("Erro ao atualizar a função:", error);
            alert("Não foi possível atualizar a função do usuário.");
        }
    };

    return (
        <div className="animate-fade-in">
            <BackButton onClick={onBack} />
            <div className="text-center mb-12"><h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>GESTÃO DE USUÁRIOS</h1><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">Gerencie as permissões e funções dos membros.</p></div>
            
            {loading && <p>Carregando usuários...</p>}
            {error && <ErrorDisplay message={error} instructions={
                <p className="font-bold mt-4">Para corrigir, você precisa ter uma função de 'TI', 'Pastor' ou 'Líder' e ter aplicado as <a href="#firebase_rules_admin" className="underline">novas regras de segurança</a> no Firebase.</p>
            } />}
            
            {!loading && !error && (
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="p-4">Nome</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Função</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.uid} className="border-b border-gray-200 hover:bg-gray-100/50">
                                    <td className="p-4 font-semibold">{user.name}</td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <select 
                                            value={user.role} 
                                            onChange={(e) => handleRoleChange(user.uid, e.target.value as Role)}
                                            className="p-2 bg-white border border-gray-300 rounded-lg"
                                        >
                                            <option>Membro</option><option>Líder</option><option>Pastor</option><option>TI</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


const ProfilePage = ({ user, onBack, onProfileUpdate }: { user: UserProfile, onBack: () => void, onProfileUpdate: (updatedUser: UserProfile) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = async () => {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { name }, { merge: true });
        onProfileUpdate({ ...user, name });
        setIsEditing(false);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return; setIsUploading(true);
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const photoUrl = await getDownloadURL(snapshot.ref);
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { photoUrl }, { merge: true });
            if (auth.currentUser) { await updateAuthProfile(auth.currentUser, { photoURL: photoUrl }); }
            onProfileUpdate({ ...user, photoUrl });
        } catch (error) { console.error("Erro ao fazer upload da foto:", error); } 
        finally { setIsUploading(false); }
    };
    
    return (
        <div className="animate-fade-in"><BackButton onClick={onBack} /><div className="max-w-md mx-auto"><div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/40 text-center">
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" hidden/>
            <div className="relative w-32 h-32 mx-auto mb-6 group">
                {isUploading ? <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div></div> : <img src={user.photoUrl || `https://placehold.co/128x128/EAE8E1/1a1a1a?text=${user.name?.charAt(0)}`} alt="Foto de Perfil" className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"/>}
                <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"><Camera size={32} /></button>
            </div>
            {isEditing ? <input type="text" value={name} onChange={e => setName(e.target.value)} className="text-3xl font-black text-center bg-transparent border-b-2 border-black/50 outline-none" style={{ fontFamily: "'Anton', sans-serif" }}/> : <h2 className="text-3xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>{user.name}</h2>}
            <p className="bg-black text-white px-4 py-1 text-sm rounded-full font-bold inline-block mt-2">{user.role}</p>
            <div className="text-left mt-8 space-y-4">
                <div><label className="text-sm font-bold text-gray-500">EMAIL</label><p className="text-lg text-gray-800">{user.email}</p></div>
                <div><label className="text-sm font-bold text-gray-500">M COINS</label><div className="flex items-center gap-2"><CircleDollarSign className="text-yellow-500" /><p className="text-lg text-gray-800 font-bold">{user.mcoins}</p></div></div>
            </div>
            {isEditing ? <button onClick={handleSave} className="mt-8 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">Salvar Alterações</button> : <button onClick={() => setIsEditing(true)} className="mt-8 w-full flex items-center justify-center gap-2 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"><Settings size={18}/> Editar Perfil</button>}
        </div></div></div>
    );
};

const HomePageContent = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const newsCollection = collection(db, "news");
        const unsubscribe = onSnapshot(query(newsCollection), 
            (querySnapshot) => { setNews(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem))); setError(null); },
            (err) => { console.error("Erro de permissão do Firestore na coleção 'news':", err); setError("Não foi possível carregar as notícias."); }
        );
        return () => unsubscribe();
    }, []);
    
    return (
        <div className="animate-fade-in">
             <div className="text-center mb-12"><h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>BEM-VINDO À MORIÁ</h1><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">Um lugar de transformação, comunidade e fé.</p></div>
             {error && <ErrorDisplay message={error} instructions={
                <p className="font-bold mt-4">Para corrigir, você precisa ter aplicado as <a href="#firebase_rules" className="underline">regras de segurança</a> no Firebase, permitindo leitura pública da coleção 'news'.</p>
             } />}
             <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                 {news.length > 0 ? news.map((newsItem) => (<div key={newsItem.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group"><div className="overflow-hidden"><img src={newsItem.imageUrl} alt={newsItem.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"/></div><div className="p-6"><p className="text-sm font-bold text-gray-500 tracking-widest uppercase">{newsItem.category}</p><h3 className="mt-2 text-2xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>{newsItem.title}</h3><p className="mt-3 text-gray-600 leading-relaxed">{newsItem.summary}</p><div className="mt-6 flex items-center justify-between text-sm text-gray-500"><span>Por: {newsItem.author}</span><span>{newsItem.date}</span></div></div></div>)) : !error && <p>Carregando notícias...</p>}
             </div>
        </div>
    );
};

const GincanaPage = ({ onBack }: { onBack: () => void }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [individualScores, setIndividualScores] = useState<IndividualScore[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const teamsUnsubscribe = onSnapshot(collection(db, "gincanaTeams"), (snapshot) => { setTeams(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team))); setError(null); }, (err) => { setError("Não foi possível carregar os dados da gincana."); });
        const scoresUnsubscribe = onSnapshot(collection(db, "gincanaIndividualScores"), (snapshot) => { setIndividualScores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IndividualScore))); setError(null); }, (err) => { setError("Não foi possível carregar os dados da gincana."); });
        return () => { teamsUnsubscribe(); scoresUnsubscribe(); };
    }, []);

    const calculateTeamScore = (team: Team) => team.scores.reduce((total, item) => total + item.score, 0);
    const teamScores = teams.map(team => ({ name: team.name, score: calculateTeamScore(team) }));

    return (
         <div className="animate-fade-in">
            <BackButton onClick={onBack} />
            <div className="text-center mb-12"><h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>GINCANA MORIÁ</h1><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">Acompanhe a pontuação em tempo real!</p></div>
            {error ? <ErrorDisplay message={error} /> : ( <>
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 mb-12"><h2 className="text-3xl font-black text-center mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>PLACAR GERAL</h2><div className="flex justify-around items-center text-center">{teamScores.map((team, index) => (<React.Fragment key={team.name}><div><p className="text-2xl md:text-3xl font-bold">{team.name}</p><p className="text-6xl md:text-7xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>{team.score}</p></div>{index === 0 && <div className="text-4xl font-light text-gray-400">vs</div>}</React.Fragment>))}</div></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">{teams.map(team => (<div key={team.id} className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200"><h3 className="text-3xl font-black mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>{team.name}</h3><p className="text-md text-gray-600 mb-4">Líder: {team.leader}</p><h4 className="font-bold text-lg mb-2 mt-6">Pontuação Detalhada:</h4><ul className="space-y-2 mb-6">{team.scores.map(item => (<li key={item.activity} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><span className="font-semibold text-gray-700">{item.activity}</span><span className="font-bold text-lg text-black">{item.score}</span></li>))}</ul><h4 className="font-bold text-lg mb-2 mt-6">Membros:</h4><p className="text-gray-700 leading-relaxed bg-white/70 p-3 rounded-lg">{team.members.join(', ')}</p></div>))}</div>
                <div className="mt-12 bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200"><h2 className="text-3xl font-black text-center mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>CONTAGEM INDIVIDUAL</h2><ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{individualScores.sort((a, b) => b.score - a.score).map(player => (<li key={player.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><span className="font-semibold text-gray-700">{player.name}</span><div className="flex items-center gap-2 font-bold text-lg text-black">{player.score} <Star className="text-yellow-400" size={20}/></div></li>))}</ul></div>
            </>)}
        </div>
    );
};

const EventosPage = ({ onBack }: { onBack: () => void }) => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => { setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventItem))); setError(null); }, (err) => { setError("Não foi possível carregar os eventos."); });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent, eventId: string) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const submission = { eventId, name: formData.get('name'), email: formData.get('email'), phone: formData.get('phone'), submittedAt: new Date(), };
        await addDoc(collection(db, "eventSubmissions"), submission);
        setIsSubmitted(true);
    };

    if (error) { return (<div className="animate-fade-in"><BackButton onClick={onBack} /><ErrorDisplay message={error} /></div>); }
    if (events.length === 0) return <div>Carregando eventos...</div>;
    const currentEvent = events[0];

    return (
        <div className="animate-fade-in"><BackButton onClick={onBack} /><div className="text-center mb-12"><h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>INSCRIÇÃO DE EVENTOS</h1><p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">Garanta sua vaga nos próximos eventos.</p></div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200"><img src={currentEvent.imageUrl} alt={currentEvent.title} className="w-full h-56 object-cover rounded-lg mb-6" /><h2 className="text-3xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>{currentEvent.title}</h2><p className="font-bold text-gray-600 mt-2">{currentEvent.date}</p><p className="text-gray-700 mt-4">{currentEvent.description}</p></div>
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200">
                {isSubmitted ? (<div className="text-center flex flex-col items-center justify-center h-full py-10"><ShieldCheck size={48} className="text-green-500 mb-4" /><h3 className="text-2xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>INSCRIÇÃO REALIZADA!</h3><p className="text-gray-700 mt-2">Obrigado! Você receberá um email de confirmação.</p><button onClick={() => setIsSubmitted(false)} className="mt-6 font-semibold text-gray-600 hover:text-black underline">Inscrever outra pessoa</button></div>) : (<><h3 className="text-2xl font-black text-center mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>PREENCHA SEUS DADOS</h3><form onSubmit={(e) => handleSubmit(e, currentEvent.id)}><div className="space-y-4"><div><label className="text-sm font-bold text-gray-700">Nome Completo</label><input name="name" type="text" required className="mt-1 w-full p-3 bg-white/70 rounded-lg" /></div><div><label className="text-sm font-bold text-gray-700">Email</label><input name="email" type="email" required className="mt-1 w-full p-3 bg-white/70 rounded-lg" /></div><div><label className="text-sm font-bold text-gray-700">Telefone (WhatsApp)</label><input name="phone" type="tel" className="mt-1 w-full p-3 bg-white/70 rounded-lg" /></div></div><div className="mt-8"><button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800">Confirmar Inscrição</button></div></form></>)}
            </div>
        </div></div>
    );
};

const ScalePlaceholderPage = ({ title, icon, onBack }: { title: string, icon: React.ReactNode, onBack: () => void }) => (
    <div className="animate-fade-in"><BackButton onClick={onBack} /><div className="text-center flex flex-col items-center justify-center h-[50vh]"><div className="text-black mb-4">{icon}</div><h1 className="text-6xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>{title}</h1><p className="mt-4 text-xl text-gray-700">Esta seção está em desenvolvimento.</p></div></div>
);

const DashboardCard = ({ title, icon, onClick, gradientColors }: { title: string; icon: React.ReactNode; onClick: () => void; gradientColors: string; }) => (
    <button onClick={onClick} className={`relative group overflow-hidden p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center text-white h-56 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${gradientColors} animate-gradient-flow`}>
        <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-300"></div><div className="relative z-10 flex flex-col items-center"><div className="mb-4">{icon}</div><h3 className="text-3xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>{title}</h3></div>
    </button>
);

const WelcomePage = ({ user, navigateTo }: { user: UserProfile | null; navigateTo: (page: Page) => void }) => {
    const availablePages = [{ name: 'Gincana', page: 'gincana', icon: <Swords size={48} />, gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500' }];
    if (user?.role === 'Pastor' || user?.role === 'Líder' || user?.role === 'TI') {
        availablePages.push(
            { name: 'Gerenciar Usuários', page: 'userManagement', icon: <Users size={48} />, gradient: 'bg-gradient-to-br from-red-500 to-orange-500' },
            { name: 'Escala Mídia', page: 'escalaMidia', icon: <ShieldCheck size={48} />, gradient: 'bg-gradient-to-br from-cyan-400 to-blue-600' },
            { name: 'Escala Louvor', page: 'escalaLouvor', icon: <Music size={48} />, gradient: 'bg-gradient-to-br from-purple-500 to-pink-600' },
            { name: 'Criar Evento', page: 'criacaoEvento', icon: <PlusSquare size={48} />, gradient: 'bg-gradient-to-br from-green-400 to-teal-500' },
            { name: 'Gerir Eventos', page: 'gestaoEventos', icon: <ClipboardList size={48} />, gradient: 'bg-gradient-to-br from-indigo-400 to-purple-500' },
            { name: 'Financeiro', page: 'financeiro', icon: <Banknote size={48} />, gradient: 'bg-gradient-to-br from-gray-500 to-gray-700' }
        );
    }
    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12"><h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>PAINEL DE CONTROLE</h1><p className="mt-4 text-xl text-gray-800">Olá, {user ? `${user.role} ${user.name}` : 'Visitante'}.</p><p className="mt-1 text-lg text-gray-600">Selecione uma área para gerenciar.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{availablePages.map(item => (<DashboardCard key={item.name} title={item.name} icon={item.icon} onClick={() => navigateTo(item.page as Page)} gradientColors={item.gradient}/>))}</div>
        </div>
    );
};

const Header = ({ isAuthenticated, user, navigateTo, onLogout }: { isAuthenticated: boolean; user: UserProfile | null; navigateTo: (page: Page) => void; onLogout: () => void; }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleNavClick = (page: Page) => { navigateTo(page); setIsMenuOpen(false); };
    const publicLinks = [ { name: 'Home', page: 'home', icon: <Home size={20}/> }, { name: 'Eventos', page: 'eventos', icon: <Ticket size={20}/> }, { name: 'Sobre', page: 'sobre', icon: <Info size={20}/> }, ];
    return (
     <header className="bg-[#F5F3EF] sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-20">
            <button onClick={() => handleNavClick(isAuthenticated ? 'welcome' : 'home')} className="flex-shrink-0"><img className="h-10 w-auto" src={logoUrl} alt="Logo Igreja Moriá"/></button>
            <nav className="hidden md:flex md:items-center md:space-x-8">{publicLinks.map((link) => (<button key={link.name} onClick={() => handleNavClick(link.page as Page)} className="font-semibold text-gray-700 hover:text-black transition-colors">{link.name}</button>))}</nav>
            <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated && user ? (<><button onClick={() => navigateTo('perfil')} className="flex items-center justify-center gap-4 bg-gray-200/80 pl-4 pr-2 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"><div className="flex items-center gap-2"><User size={18} /> {user.name?.split(' ')[0]}</div><div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold"><CircleDollarSign size={14} /><span>{user.mcoins}</span></div></button><button onClick={onLogout} title="Sair" className="p-2 rounded-lg hover:bg-gray-200 transition-colors"><LogOut size={20} /></button></>) : (<button onClick={() => navigateTo('login')} className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"><User size={18} /> Login</button>)}
            </div>
            <div className="md:hidden flex items-center"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-800">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button></div>
        </div></div>
        {isMenuOpen && (<div className="md:hidden bg-white border-t"><div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">{publicLinks.map((link) => (<button key={link.name} onClick={() => handleNavClick(link.page as Page)} className="w-full text-left flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium">{link.icon} {link.name}</button>))}</div><div className="pt-4 pb-3 border-t px-5">{isAuthenticated ? (<div className="space-y-3"><button onClick={() => handleNavClick('perfil')} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-black px-4 py-3 rounded-lg font-semibold"><User size={18} /> Perfil</button><button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold"><LogOut size={18} /> Sair</button></div>) : (<button onClick={() => handleNavClick('login')} className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg font-semibold"><User size={18} /> Login / Cadastrar</button>)}</div></div>)}
    </header>
  );
};

const Footer = () => ( <footer className="bg-black text-white mt-auto"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center"><img src={logoUrl} alt="Logo Igreja Moriá" className="mx-auto h-8 w-auto mb-4 invert"/><p>&copy; {new Date().getFullYear()} Igreja Moriá. Todos os direitos reservados.</p></div></footer> );

// --- COMPONENTES PRINCIPAL (APP) ---
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [pageHistory, setPageHistory] = useState<Page[]>(['home']);
  const currentPage = pageHistory[pageHistory.length - 1];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if(userDoc.exists()){
                const userData = userDoc.data() as Omit<UserProfile, 'uid' | 'email'>;
                setCurrentUser({ uid: user.uid, email: user.email || '', ...userData, photoUrl: user.photoURL || userData.photoUrl });
                if(pageHistory.length === 1 && pageHistory[0] === 'home') { setPageHistory(['welcome']); }
            } else { await signOut(auth); }
        } else {
            setCurrentUser(null);
            setPageHistory(['home']);
        }
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, [pageHistory]);

  const navigateTo = (page: Page) => setPageHistory(prev => [...prev, page]);
  const handleGoBack = () => { if (pageHistory.length > 1) { setPageHistory(prev => prev.slice(0, -1)); }};
  const handleLogout = async () => { await signOut(auth); };
  const handleProfileUpdate = (updatedUser: UserProfile) => { setCurrentUser(updatedUser); };
  
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    const isAuthenticated = !!currentUser;

    if (!isAuthenticated) {
        if (currentPage === 'login') return <LoginPage navigateTo={navigateTo} />;
        if (currentPage === 'cadastro') return <RegisterPage navigateTo={navigateTo} />;
    }

    return (
      <div className="bg-[#F5F3EF] min-h-screen text-[#1a1a1a] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
        <style>{`@keyframes fade-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:fade-in .5s ease-out forwards}@keyframes gradient-flow{0%{background-position:0 50%}50%{background-position:100% 50%}100%{background-position:0 50%}}.animate-gradient-flow{background-size:200% 200%;animation:gradient-flow 5s ease infinite}`}</style>
        <Header isAuthenticated={isAuthenticated} user={currentUser} navigateTo={navigateTo} onLogout={handleLogout} />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
          {renderPageContent(isAuthenticated, currentPage, currentUser)}
        </main>
        <Footer />
      </div>
    );
  };
  
  const renderPageContent = (isAuthenticated: boolean, page: Page, user: UserProfile | null) => {
    if (!isAuthenticated) {
        switch(page) {
            case 'eventos': return <EventosPage onBack={() => navigateTo('home')} />;
            case 'sobre': return <div className="text-center p-10"><h1 className="text-3xl font-bold">Página Sobre em Construção</h1></div>;
            case 'home': default: return <HomePageContent />;
        }
    } else {
        switch (page) {
            case 'welcome': return <WelcomePage user={user} navigateTo={navigateTo} />;
            case 'gincana': return <GincanaPage onBack={handleGoBack} />;
            case 'perfil': return <ProfilePage user={user!} onBack={handleGoBack} onProfileUpdate={handleProfileUpdate}/>;
            case 'userManagement': return <UserManagementPage onBack={handleGoBack} />;
            case 'escalaMidia': return <ScalePlaceholderPage title="ESCALA DE MÍDIA" icon={<ShieldCheck size={48} />} onBack={handleGoBack} />;
            case 'escalaLouvor': return <ScalePlaceholderPage title="ESCALA DE LOUVOR" icon={<Music size={48} />} onBack={handleGoBack} />;
            case 'criacaoEvento': return <ScalePlaceholderPage title="CRIAÇÃO DE EVENTOS" icon={<PlusSquare size={48} />} onBack={handleGoBack} />;
            case 'gestaoEventos': return <ScalePlaceholderPage title="GESTÃO DE EVENTOS" icon={<ClipboardList size={48} />} onBack={handleGoBack} />;
            case 'financeiro': return <ScalePlaceholderPage title="FINANCEIRO" icon={<Banknote size={48} />} onBack={handleGoBack} />;
            case 'home': return <HomePageContent />;
            case 'eventos': return <EventosPage onBack={handleGoBack} />;
            case 'sobre': return <div className="text-center p-10"><h1 className="text-3xl font-bold">Página Sobre em Construção</h1></div>;
            default: return <WelcomePage user={user} navigateTo={navigateTo} />;
        }
    }
  };

  return <>{renderContent()}</>;
}