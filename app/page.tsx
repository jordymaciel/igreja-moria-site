"use client";

import React, { useState, useMemo } from 'react';
import { Home, Info, Menu, X, User, ArrowRight, Swords, Star, ShieldCheck, Music, CalendarDays, LogOut, Settings, Camera, ArrowLeft, Ticket, PlusSquare, ClipboardList, Banknote, CircleDollarSign } from 'lucide-react';

// --- DEFINIÇÕES DE TIPO ---
type Role = 'Membro' | 'TI' | 'Pastor' | 'Líder';
type Page = 'home' | 'sobre' | 'gincana' | 'login' | 'welcome' | 'perfil' | 'escalaMidia' | 'escalaLouvor' | 'eventos' | 'criacaoEvento' | 'gestaoEventos' | 'financeiro';

type UserProfile = {
  name: string;
  email: string;
  role: Role;
  photoUrl?: string;
  mcoins: number;
};

type NewsItem = {
  id: number;
  category: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  imageUrl: string;
};

type EventItem = {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
};

type ActivityScore = {
  activity: string;
  score: number;
};

type Team = {
  name: string;
  leader: string;
  members: string[];
  scores: ActivityScore[];
};

type IndividualScore = {
    name: string;
    score: number;
};


// --- DADOS MOCK (EXEMPLO) ---
// Coloque o arquivo "logo preta.png" na pasta /public do seu projeto
const logoUrl = '/logo preta.png'; // Substitua pelo caminho da sua logo

const mockUser: UserProfile = {
  name: 'Carlos Gabryell',
  email: 'pastor@moria.com',
  role: 'Pastor', // Altere para 'Membro' para ver a visão de um membro comum
  photoUrl: 'https://placehold.co/128x128/EAE8E1/1a1a1a?text=CG',
  mcoins: 250,
};

const mockNews: NewsItem[] = [
  {
    id: 1,
    category: 'EVENTOS',
    title: 'Conferência ELEVA 2025',
    summary: 'Prepare-se para uma experiência transformadora. A conferência ELEVA está chegando com convidados especiais e momentos de profunda conexão.',
    author: 'Pr. João Silva',
    date: '25 de Agosto, 2025',
    imageUrl: 'https://placehold.co/600x400/f0f0f0/1a1a1a?text=ELEVA+CONF',
  },
  {
    id: 2,
    category: 'COMUNIDADE',
    title: 'Novo Grupo de Jovens',
    summary: 'Lançamos um novo grupo de jovens para fortalecer os laços e crescer na fé. Encontros toda sexta-feira às 19h.',
    author: 'Líder de Jovens Maria',
    date: '22 de Agosto, 2025',
    imageUrl: 'https://placehold.co/600x400/f0f0f0/1a1a1a?text=Jovens',
  },
  {
    id: 3,
    category: 'MINISTÉRIOS',
    title: 'Ação Social de Inverno',
    summary: 'Nossa campanha de arrecadação de agasalhos foi um sucesso! Agradecemos a todos que contribuíram para aquecer quem mais precisa.',
    author: 'Diácono Pedro',
    date: '18 de Agosto, 2025',
    imageUrl: 'https://placehold.co/600x400/f0f0f0/1a1a1a?text=Ação+Social',
  },
];

const mockEvents: EventItem[] = [
  {
    id: 1,
    title: 'Conferência ELEVA 2025',
    date: '08 de Novembro, 2025 - 18:00h',
    description: 'Uma conferência para elevar sua fé e transformar sua vida. Teremos louvor, palavra e comunhão. Vagas limitadas.',
    imageUrl: 'https://placehold.co/600x400/f0f0f0/1a1a1a?text=ELEVA+CONF',
  },
];

const gincanaTeams: Team[] = [
    {
        name: 'Abençoados',
        leader: 'Juan Gabriell',
        members: ['Sophia', 'Geovane', 'Haniel', 'Pedro', 'Arielly', 'Brendow', 'Larissa', 'Arthur', 'Julia'],
        scores: [
            { activity: 'Vôlei', score: 0 },
            { activity: 'Futebol', score: 0 },
            { activity: 'Natação', score: 1 },
            { activity: 'Perguntas e Respostas', score: 1 },
        ]
    },
    {
        name: 'Remidos',
        leader: 'Carlos Gabryell',
        members: ['Alamys', 'Israel', 'Jordy', 'Francisco', 'Guilherme/Fernanda', 'Fernando/Giovana', 'Bernardo', 'Rebeca'],
        scores: [
            { activity: 'Vôlei', score: 1 },
            { activity: 'Futebol', score: 1 },
            { activity: 'Natação', score: 0 },
            { activity: 'Perguntas e Respostas', score: 0 },
        ]
    }
];

const individualScores: IndividualScore[] = [
    { name: 'Rebeca', score: 2 },
    { name: 'Arielly', score: 1 },
    { name: 'Larissa', score: 2 },
    { name: 'Juan', score: 2 },
    { name: 'Francisco', score: 2 },
    { name: 'Geovane', score: 1 },
    { name: 'Fernanda', score: 1 },
    { name: 'Guilherme', score: 1 },
    { name: 'Alamys', score: 1 },
    { name: 'Sophia', score: 1 },
];


// --- COMPONENTES GERAIS ---
const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button 
        onClick={onClick} 
        className="flex items-center gap-2 font-semibold text-gray-600 hover:text-black transition-colors mb-8"
    >
        <ArrowLeft size={18} />
        Voltar
    </button>
);


// --- COMPONENTES DE PÁGINA ---

const LoginPage = ({ onLogin }: { onLogin: (user: UserProfile) => void }) => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F5F3EF] to-[#EAE8E1]">
      <div className="absolute inset-0 bg-no-repeat bg-center" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/sandy-sand.png')", opacity: 0.1}}></div>
      <div className="w-full max-w-md mx-auto z-10 animate-fade-in">
        <div className="text-center mb-8">
            <img src={logoUrl} alt="Logo Igreja Moriá" className="mx-auto h-12 w-auto mb-6" onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = 'https://placehold.co/150x50/000000/F5F3EF?text=LOGO+MORIÁ'; }}/>
            <h1 className="text-5xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>
              BEM-VINDO
            </h1>
            <p className="text-gray-600">Faça login para continuar</p>
        </div>
        <div className="bg-white/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/40">
          <form onSubmit={(e) => { e.preventDefault(); onLogin(mockUser); }}>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-700">Email</label>
                <input type="email" placeholder="seuemail@exemplo.com" className="mt-1 w-full p-3 bg-white/50 border-2 border-transparent focus:border-black/50 rounded-lg outline-none transition duration-300" defaultValue={mockUser.email} />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Senha</label>
                <input type="password" placeholder="••••••••" className="mt-1 w-full p-3 bg-white/50 border-2 border-transparent focus:border-black/50 rounded-lg outline-none transition duration-300" defaultValue="123456" />
              </div>
            </div>
            <div className="mt-8">
              <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                Entrar
              </button>
            </div>
            <div className="text-center mt-6 text-sm">
                <a href="#" className="font-semibold text-gray-700 hover:underline">Esqueceu a senha?</a>
                <span className="mx-2 text-gray-400">|</span>
                <a href="#" className="font-semibold text-gray-700 hover:underline">Solicitar cadastro</a>
            </div>
          </form>
        </div>
      </div>
    </div>
);

const WelcomePage = ({ user, navigateTo }: { user: UserProfile | null; navigateTo: (page: Page) => void }) => {
    const availablePages = useMemo(() => {
        const pages = [
            { name: 'Gincana', page: 'gincana', icon: <Swords size={48} />, gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
        ];
        if (user?.role === 'Pastor' || user?.role === 'Líder') {
            pages.push(
                { name: 'Escala Mídia', page: 'escalaMidia', icon: <ShieldCheck size={48} />, gradient: 'bg-gradient-to-br from-cyan-400 to-blue-600' },
                { name: 'Escala Louvor', page: 'escalaLouvor', icon: <Music size={48} />, gradient: 'bg-gradient-to-br from-purple-500 to-pink-600' },
                { name: 'Criar Evento', page: 'criacaoEvento', icon: <PlusSquare size={48} />, gradient: 'bg-gradient-to-br from-green-400 to-teal-500' },
                { name: 'Gerir Eventos', page: 'gestaoEventos', icon: <ClipboardList size={48} />, gradient: 'bg-gradient-to-br from-indigo-400 to-purple-500' },
                { name: 'Financeiro', page: 'financeiro', icon: <Banknote size={48} />, gradient: 'bg-gradient-to-br from-gray-500 to-gray-700' }
            );
        }
        return pages;
    }, [user]);

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>PAINEL DE CONTROLE</h1>
                <p className="mt-4 text-xl text-gray-800">
                    Olá, {user ? `${user.role} ${user.name}` : 'Visitante'}.
                </p>
                <p className="mt-1 text-lg text-gray-600">Selecione uma área para gerenciar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availablePages.map(item => (
                    <DashboardCard 
                        key={item.name} 
                        title={item.name} 
                        icon={item.icon} 
                        onClick={() => navigateTo(item.page as Page)}
                        gradientColors={item.gradient}
                    />
                ))}
            </div>
        </div>
    );
};

const ProfilePage = ({ user, onBack }: { user: UserProfile | null, onBack: () => void }) => (
    <div className="animate-fade-in">
        <BackButton onClick={onBack} />
        <div className="max-w-md mx-auto">
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/40 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6 group">
                    <img 
                        src={user?.photoUrl || `https://placehold.co/128x128/EAE8E1/1a1a1a?text=${user?.name?.charAt(0)}`} 
                        alt="Foto de Perfil" 
                        className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                        onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = 'https://placehold.co/128x128/EAE8E1/1a1a1a?text=??'; }}
                    />
                    <button className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                        <Camera size={32} />
                    </button>
                </div>

                <h2 className="text-3xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>{user?.name}</h2>
                <p className="bg-black text-white px-4 py-1 text-sm rounded-full font-bold inline-block mt-2">{user?.role}</p>

                <div className="text-left mt-8 space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-500">EMAIL</label>
                        <p className="text-lg text-gray-800">{user?.email}</p>
                    </div>
                     <div>
                        <label className="text-sm font-bold text-gray-500">M COINS</label>
                        <div className="flex items-center gap-2">
                            <CircleDollarSign className="text-yellow-500" />
                            <p className="text-lg text-gray-800 font-bold">{user?.mcoins}</p>
                        </div>
                    </div>
                </div>

                <button className="mt-8 w-full flex items-center justify-center gap-2 bg-gray-200 text-black py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                    <Settings size={18}/> Editar Perfil
                </button>
            </div>
        </div>
    </div>
);


const ScalePlaceholderPage = ({ title, icon, onBack }: { title: string, icon: React.ReactNode, onBack: () => void }) => (
    <div className="animate-fade-in">
        <BackButton onClick={onBack} />
        <div className="text-center flex flex-col items-center justify-center h-[50vh]">
            <div className="text-black mb-4">{icon}</div>
            <h1 className="text-6xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>{title}</h1>
            <p className="mt-4 text-xl text-gray-700">Esta seção está em desenvolvimento.</p>
        </div>
    </div>
);

const NewsCard = ({ news }: { news: NewsItem }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group">
    <div className="overflow-hidden">
      <img src={news.imageUrl} alt={`Imagem para ${news.title}`} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = 'https://placehold.co/600x400/f0f0f0/1a1a1a?text=Erro+na+Imagem'; }} />
    </div>
    <div className="p-6">
      <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">{news.category}</p>
      <h3 className="mt-2 text-2xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>{news.title}</h3>
      <p className="mt-3 text-gray-600 leading-relaxed">{news.summary}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500"><span>Por: {news.author}</span><span>{news.date}</span></div>
      <a href="#" className="inline-flex items-center gap-2 mt-6 font-semibold text-black group-hover:underline">Ler mais <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></a>
    </div>
  </div>
);

const HomePageContent = () => (
    <div className="animate-fade-in">
        <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>BEM-VINDO À MORIÁ</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">Um lugar de transformação, comunidade e fé. Fique por dentro das últimas notícias e eventos.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mockNews.map((newsItem) => (<NewsCard key={newsItem.id} news={newsItem} />))}
        </div>
    </div>
);

const GincanaPage = ({ onBack }: { onBack: () => void }) => {
    const calculateTeamScore = (team: Team) => team.scores.reduce((total, item) => total + item.score, 0);
    const teamScores = gincanaTeams.map(team => ({ name: team.name, score: calculateTeamScore(team) }));

    return (
        <div className="animate-fade-in">
            <BackButton onClick={onBack} />
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>GINCANA MORIÁ</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">Acompanhe a pontuação em tempo real!</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 mb-12">
                 <h2 className="text-3xl font-black text-center mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>PLACAR GERAL</h2>
                 <div className="flex justify-around items-center text-center">
                    {teamScores.map((team, index) => (<React.Fragment key={team.name}><div><p className="text-2xl md:text-3xl font-bold">{team.name}</p><p className="text-6xl md:text-7xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>{team.score}</p></div>{index === 0 && <div className="text-4xl font-light text-gray-400">vs</div>}</React.Fragment>))}
                 </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {gincanaTeams.map(team => (<div key={team.name} className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200"><h3 className="text-3xl font-black mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>{team.name}</h3><p className="text-md text-gray-600 mb-4">Líder: {team.leader}</p><h4 className="font-bold text-lg mb-2 mt-6">Pontuação Detalhada:</h4><ul className="space-y-2 mb-6">{team.scores.map(item => (<li key={item.activity} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><span className="font-semibold text-gray-700">{item.activity}</span><span className="font-bold text-lg text-black">{item.score}</span></li>))}</ul><h4 className="font-bold text-lg mb-2 mt-6">Membros:</h4><p className="text-gray-700 leading-relaxed bg-white/70 p-3 rounded-lg">{team.members.join(', ')}</p></div>))}
            </div>
            <div className="mt-12 bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-3xl font-black text-center mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>CONTAGEM INDIVIDUAL</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {individualScores.sort((a, b) => b.score - a.score).map(player => (<li key={player.name} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><span className="font-semibold text-gray-700">{player.name}</span><div className="flex items-center gap-2 font-bold text-lg text-black">{player.score} <Star className="text-yellow-400" size={20}/></div></li>))}
                </ul>
            </div>
        </div>
    );
};

const EventosPage = ({ onBack }: { onBack: () => void }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui iria a lógica para enviar os dados para um backend
        console.log('Formulário de inscrição enviado!');
        setIsSubmitted(true);
    };

    return (
        <div className="animate-fade-in">
            <BackButton onClick={onBack} />
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>INSCRIÇÃO DE EVENTOS</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">Garanta sua vaga nos próximos eventos da Igreja Moriá.</p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200">
                    <img src={mockEvents[0].imageUrl} alt={mockEvents[0].title} className="w-full h-56 object-cover rounded-lg mb-6" />
                    <h2 className="text-3xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>{mockEvents[0].title}</h2>
                    <p className="font-bold text-gray-600 mt-2">{mockEvents[0].date}</p>
                    <p className="text-gray-700 mt-4">{mockEvents[0].description}</p>
                </div>
                
                <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200">
                    {isSubmitted ? (
                        <div className="text-center flex flex-col items-center justify-center h-full py-10">
                            <ShieldCheck size={48} className="text-green-500 mb-4" />
                            <h3 className="text-2xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>INSCRIÇÃO REALIZADA!</h3>
                            <p className="text-gray-700 mt-2">Você receberá um email de confirmação em breve. Obrigado!</p>
                            <button onClick={() => setIsSubmitted(false)} className="mt-6 font-semibold text-gray-600 hover:text-black underline">
                                Realizar nova inscrição
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-black text-center mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>PREENCHA SEUS DADOS</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700">Nome Completo</label>
                                        <input type="text" required className="mt-1 w-full p-3 bg-white/70 border-2 border-transparent focus:border-black/50 rounded-lg outline-none transition duration-300" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700">Email</label>
                                        <input type="email" required className="mt-1 w-full p-3 bg-white/70 border-2 border-transparent focus:border-black/50 rounded-lg outline-none transition duration-300" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-700">Telefone (WhatsApp)</label>
                                        <input type="tel" className="mt-1 w-full p-3 bg-white/70 border-2 border-transparent focus:border-black/50 rounded-lg outline-none transition duration-300" />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                                        Confirmar Inscrição
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTES GERAIS ---
const DashboardCard = ({ title, icon, onClick, gradientColors }: { title: string; icon: React.ReactNode; onClick: () => void; gradientColors: string; }) => (
    <button
        onClick={onClick}
        className={`relative group overflow-hidden p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center text-white h-56 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${gradientColors} animate-gradient-flow`}
    >
        <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity duration-300"></div>
        <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4">{icon}</div>
            <h3 className="text-3xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>{title}</h3>
        </div>
    </button>
);

const Header = ({ isAuthenticated, user, navigateTo, onLogout }: { isAuthenticated: boolean; user: UserProfile | null; navigateTo: (page: Page) => void; onLogout: () => void; }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = useMemo(() => {
    const publicLinks = [
        { name: 'Home', page: isAuthenticated ? 'welcome' : 'home', icon: <Home size={20} /> },
        { name: 'Eventos', page: 'eventos', icon: <Ticket size={20} /> },
        { name: 'Sobre', page: 'sobre', icon: <Info size={20} /> },
    ];
    
    if (isAuthenticated) {
        const memberLinks = [...publicLinks, { name: 'Gincana', page: 'gincana', icon: <Swords size={20} /> }];
        
        if (user?.role === 'Pastor' || user?.role === 'Líder') {
            memberLinks.push(
                { name: 'Escala Mídia', page: 'escalaMidia', icon: <ShieldCheck size={20} /> },
                { name: 'Escala Louvor', page: 'escalaLouvor', icon: <Music size={20} /> },
                { name: 'Gestão', page: 'welcome', icon: <Settings size={20} /> }
            );
        }
        return memberLinks;
    }
    return publicLinks;
  }, [isAuthenticated, user]);

  const handleNavClick = (page: Page) => {
    navigateTo(page);
    setIsMenuOpen(false);
  };

  return (
     <header className="bg-[#F5F3EF] sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <a href="#" onClick={() => handleNavClick(isAuthenticated ? 'welcome' : 'home')} className="flex-shrink-0">
                    <img className="h-10 w-auto" src={logoUrl} alt="Logo Igreja Moriá" onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = 'https://placehold.co/150x50/000000/F5F3EF?text=LOGO+MORIÁ'; }}/>
                </a>
                <nav className="hidden md:flex md:items-center md:space-x-8">
                    {navLinks.map((link) => (<button key={link.name} onClick={() => handleNavClick(link.page as Page)} className="font-semibold text-gray-700 hover:text-black transition-colors">{link.name}</button>))}
                </nav>
                <div className="hidden md:flex items-center space-x-4">
                    {isAuthenticated && user ? (
                    <>
                        <button onClick={() => navigateTo('perfil')} className="flex items-center justify-center gap-4 bg-gray-200/80 pl-4 pr-2 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                            <div className="flex items-center gap-2">
                                <User size={18} /> 
                                {user.name?.split(' ')[0]}
                            </div>
                            <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
                                <CircleDollarSign size={14} />
                                <span>{user.mcoins}</span>
                            </div>
                        </button>
                        <button onClick={onLogout} title="Sair" className="p-2 rounded-lg hover:bg-gray-200 transition-colors"><LogOut size={20} /></button>
                    </>
                    ) : (
                        <button onClick={() => navigateTo('login')} className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"><User size={18} /> Login</button>
                    )}
                </div>
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-800">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
                </div>
            </div>
        </div>
        {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navLinks.map((link) => (<button key={link.name} onClick={() => handleNavClick(link.page as Page)} className="w-full text-left flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium">{link.icon} {link.name}</button>))}
                </div>
                <div className="pt-4 pb-3 border-t px-5">
                    {isAuthenticated ? (<div className="space-y-3"><button onClick={() => handleNavClick('perfil')} className="w-full flex items-center justify-center gap-2 bg-gray-200 text-black px-4 py-3 rounded-lg font-semibold"><User size={18} /> Perfil de {user?.name?.split(' ')[0]}</button><button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold"><LogOut size={18} /> Sair</button></div>) : (<button onClick={() => handleNavClick('login')} className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg font-semibold"><User size={18} /> Login / Cadastrar</button>)}
                </div>
            </div>
        )}
    </header>
  );
};


// --- COMPONENTE PRINCIPAL (APP) ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [pageHistory, setPageHistory] = useState<Page[]>(['home']);
  const currentPage = pageHistory[pageHistory.length - 1];

  const navigateTo = (page: Page) => {
    setPageHistory(prev => [...prev, page]);
  };

  const handleGoBack = () => {
    if (pageHistory.length > 1) {
      setPageHistory(prev => prev.slice(0, -1));
    }
  };

  const handleLogin = (user: UserProfile) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setPageHistory(['welcome']);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setPageHistory(['home']);
  };

  const renderPage = () => {
    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} />;
    }
    
    return (
        <div className="bg-[#F5F3EF] min-h-screen text-[#1a1a1a]" style={{ fontFamily: "'Inter', sans-serif" }}>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
                @keyframes gradient-flow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-flow {
                    background-size: 200% 200%;
                    animation: gradient-flow 5s ease infinite;
                }
            `}</style>
            
            <Header isAuthenticated={isAuthenticated} user={currentUser} navigateTo={navigateTo} onLogout={handleLogout} />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {currentPage === 'welcome' && <WelcomePage user={currentUser} navigateTo={navigateTo} />}
                {currentPage === 'home' && <HomePageContent />}
                {currentPage === 'eventos' && <EventosPage onBack={handleGoBack} />}
                {currentPage === 'sobre' && <div className="text-center p-10"><h1 className="text-3xl font-bold">Página Sobre em Construção</h1></div>}
                {currentPage === 'gincana' && <GincanaPage onBack={handleGoBack} />}
                {currentPage === 'perfil' && <ProfilePage user={currentUser} onBack={handleGoBack}/>}
                {currentPage === 'escalaMidia' && <ScalePlaceholderPage title="ESCALA DE MÍDIA" icon={<ShieldCheck size={48} />} onBack={handleGoBack} />}
                {currentPage === 'escalaLouvor' && <ScalePlaceholderPage title="ESCALA DE LOUVOR" icon={<Music size={48} />} onBack={handleGoBack} />}
                {currentPage === 'criacaoEvento' && <ScalePlaceholderPage title="CRIAÇÃO DE EVENTOS" icon={<PlusSquare size={48} />} onBack={handleGoBack} />}
                {currentPage === 'gestaoEventos' && <ScalePlaceholderPage title="GESTÃO DE EVENTOS" icon={<ClipboardList size={48} />} onBack={handleGoBack} />}
                {currentPage === 'financeiro' && <ScalePlaceholderPage title="FINANCEIRO" icon={<Banknote size={48} />} onBack={handleGoBack} />}
            </main>

            <footer className="bg-black text-white mt-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <img src={logoUrl} alt="Logo Igreja Moriá" className="mx-auto h-8 w-auto mb-4 invert" onError={(e) => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = 'https://placehold.co/120x40/FFFFFF/000000?text=LOGO+MORIÁ'; }}/>
                <p>&copy; {new Date().getFullYear()} Igreja Moriá. Todos os direitos reservados.</p>
              </div>
            </footer>
        </div>
    );
  };

  return <>{renderPage()}</>;
}

