"use client"; // Adicionado para marcar como um Componente de Cliente

import React, { useState } from 'react';
import { Home, Info, Menu, X, User, ArrowRight, Swords, Star } from 'lucide-react';

// --- DEFINIÇÕES DE TIPO ---
type NewsItem = {
  id: number;
  category: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  imageUrl: string;
};

// Tipos atualizados para a Gincana
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

type Page = 'home' | 'sobre' | 'gincana';


// --- DADOS DE EXEMPLO (MOCK) ---
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

// --- DADOS DA GINCANA ATUALIZADOS ---
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


// --- COMPONENTES ---

// Componente para o Cabeçalho (Header)
const Header = ({ setCurrentPage }: { setCurrentPage: (page: Page) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const colors = { background: '#F5F3EF', text: '#1a1a1a' };

  const navLinks = [
    { name: 'Home', icon: <Home size={20} />, href: '#', page: 'home' as Page },
    { name: 'Sobre', icon: <Info size={20} />, href: '#', page: 'sobre' as Page },
    { name: 'Gincana', icon: <Swords size={20} />, href: '#', page: 'gincana' as Page },
  ];

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <header style={{ backgroundColor: colors.background }} className="sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" onClick={() => handleNavClick('home')} className="text-3xl font-black tracking-tighter" style={{ color: colors.text, fontFamily: "'Anton', sans-serif" }}>
              IGREJA MORIÁ
            </a>
          </div>

          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => handleNavClick(link.page)} className="font-semibold text-gray-700 hover:text-black transition-colors duration-300">
                {link.name}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            <button className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300">
              <User size={18} /> Login
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-gray-200 focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button key={link.name} onClick={() => handleNavClick(link.page)} className="w-full text-left flex items-center gap-3 text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                {link.icon} {link.name}
              </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 px-5">
            <button className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300">
              <User size={18} /> Login / Cadastrar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

// Componente para um Card de Notícia
const NewsCard = ({ news }: { news: NewsItem }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group">
    <div className="overflow-hidden">
      <img
        src={news.imageUrl} alt={`Imagem para ${news.title}`}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = 'https://placehold.co/600x400/f0f0f0/1a1a1a?text=Erro+na+Imagem';
        }}
      />
    </div>
    <div className="p-6">
      <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">{news.category}</p>
      <h3 className="mt-2 text-2xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>{news.title}</h3>
      <p className="mt-3 text-gray-600 leading-relaxed">{news.summary}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <span>Por: {news.author}</span>
        <span>{news.date}</span>
      </div>
      <a href="#" className="inline-flex items-center gap-2 mt-6 font-semibold text-black group-hover:underline">
        Ler mais <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  </div>
);

// Componente para a Página da Gincana (Atualizado)
const GincanaPage = () => {
    const calculateTeamScore = (team: Team) => {
        return team.scores.reduce((total, item) => total + item.score, 0);
    };

    const teamScores = gincanaTeams.map(team => ({
        name: team.name,
        score: calculateTeamScore(team)
    }));

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>
                    GINCANA MORIÁ
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
                    Acompanhe a pontuação em tempo real!
                </p>
            </div>

            {/* Placar Geral */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200 mb-12">
                 <h2 className="text-3xl font-black text-center mb-6" style={{ fontFamily: "'Anton', sans-serif" }}>PLACAR GERAL</h2>
                 <div className="flex justify-around items-center text-center">
                    {teamScores.map((team, index) => (
                        <React.Fragment key={team.name}>
                            <div>
                                <p className="text-2xl md:text-3xl font-bold">{team.name}</p>
                                <p className="text-6xl md:text-7xl font-black" style={{ fontFamily: "'Anton', sans-serif" }}>{team.score}</p>
                            </div>
                            {index === 0 && <div className="text-4xl font-light text-gray-400">vs</div>}
                        </React.Fragment>
                    ))}
                 </div>
            </div>

            {/* Detalhes das Equipes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {gincanaTeams.map(team => (
                     <div key={team.name} className="bg-white/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200">
                        <h3 className="text-3xl font-black mb-1" style={{ fontFamily: "'Anton', sans-serif" }}>{team.name}</h3>
                        <p className="text-md text-gray-600 mb-4">Líder: {team.leader}</p>
                        
                        <h4 className="font-bold text-lg mb-2 mt-6">Pontuação Detalhada:</h4>
                        <ul className="space-y-2 mb-6">
                            {team.scores.map(item => (
                                 <li key={item.activity} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                    <span className="font-semibold text-gray-700">{item.activity}</span>
                                    <span className="font-bold text-lg text-black">{item.score}</span>
                                </li>
                            ))}
                        </ul>

                        <h4 className="font-bold text-lg mb-2 mt-6">Membros:</h4>
                        <p className="text-gray-700 leading-relaxed bg-white/70 p-3 rounded-lg">
                            {team.members.join(', ')}
                        </p>
                     </div>
                ))}
            </div>
        </div>
    );
};


// Componente para o Conteúdo da Página Home
const HomePageContent = () => (
    <div className="animate-fade-in">
         <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>
            BEM-VINDO À MORIÁ
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Um lugar de transformação, comunidade e fé. Fique por dentro das últimas notícias e eventos.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mockNews.map((newsItem) => (
                <NewsCard key={newsItem.id} news={newsItem} />
            ))}
        </div>
    </div>
);


// --- COMPONENTE PRINCIPAL (APP) ---
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const colors = { background: '#F5F3EF', text: '#1a1a1a' };

  const renderPage = () => {
    switch(currentPage) {
        case 'home':
            return <HomePageContent />;
        case 'gincana':
            return <GincanaPage />;
        case 'sobre':
            return <div className="text-center p-10"><h1 className="text-3xl font-bold">Página Sobre em Construção</h1></div>;
        default:
            return <HomePageContent />;
    }
  };

  return (
    <div style={{ backgroundColor: colors.background, color: colors.text, fontFamily: "'Inter', sans-serif" }} className="min-h-screen">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>

      <Header setCurrentPage={setCurrentPage} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderPage()}
      </main>

      <footer className="bg-black text-white mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p>&copy; {new Date().getFullYear()} Igreja Moriá. Todos os direitos reservados.</p>
          <p className="text-sm text-gray-400 mt-2">Desenvolvido com ♥</p>
        </div>
      </footer>
    </div>
  );
}

