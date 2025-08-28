"use client"; // Adicionado para marcar como um Componente de Cliente

import React, { useState } from 'react';
import { Home, Info, Menu, X, User, ArrowRight } from 'lucide-react';

// --- DEFINIÇÃO DE TIPO PARA OS DADOS ---
// Isso informa ao TypeScript como é a estrutura de um item de notícia
type NewsItem = {
  id: number;
  category: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  imageUrl: string;
};

// --- DADOS DE EXEMPLO (MOCK) ---
// Agora, o array mockNews segue a estrutura definida em NewsItem
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


// --- COMPONENTES ---

// Componente para o Cabeçalho (Header)
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Paleta de cores inspirada na imagem
  const colors = {
    background: '#F5F3EF', // Um bege claro/areia
    text: '#1a1a1a', // Preto/Chumbo
  };

  const navLinks = [
    { name: 'Home', icon: <Home size={20} />, href: '#' },
    { name: 'Sobre', icon: <Info size={20} />, href: '#' },
  ];

  return (
    <header style={{ backgroundColor: colors.background }} className="sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-3xl font-black tracking-tighter" style={{ color: colors.text, fontFamily: "'Anton', sans-serif" }}>
              IGREJA MORIÁ
            </a>
          </div>

          {/* Navegação para Desktop */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="font-semibold text-gray-700 hover:text-black transition-colors duration-300">
                {link.name}
              </a>
            ))}
          </nav>

          {/* Botão de Login para Desktop */}
          <div className="hidden md:flex items-center">
            <button
              className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
            >
              <User size={18} />
              Login
            </button>
          </div>

          {/* Botão do Menu Sanduíche para Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-gray-200 focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                {link.icon}
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-5">
              <button
                className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
              >
                <User size={18} />
                Login / Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


// Componente para um Card de Notícia
// Adicionamos a tipagem para a prop 'news'
const NewsCard = ({ news }: { news: NewsItem }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 group">
      <div className="overflow-hidden">
        <img
          src={news.imageUrl}
          alt={`Imagem para ${news.title}`}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          // Corrigimos a tipagem do evento 'onError'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = 'https://placehold.co/600x400/f0f0f0/1a1a1a?text=Erro+na+Imagem';
          }}
        />
      </div>
      <div className="p-6">
        <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">{news.category}</p>
        <h3 className="mt-2 text-2xl font-black text-gray-900" style={{ fontFamily: "'Anton', sans-serif" }}>
          {news.title}
        </h3>
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
};

// Componente Principal da Página (App)
export default function App() {
  // Paleta de cores
  const colors = {
    background: '#F5F3EF',
    text: '#1a1a1a',
  };

  return (
    // Para que as fontes funcionem, adicione no seu arquivo CSS global (ex: globals.css):
    // @import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600;700&display=swap');
    // E no seu tailwind.config.js, estenda as fontes:
    // fontFamily: {
    //   sans: ['Inter', 'sans-serif'],
    //   display: ['Anton', 'sans-serif'],
    // }
    <div style={{ backgroundColor: colors.background, color: colors.text, fontFamily: "'Inter', sans-serif" }} className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ fontFamily: "'Anton', sans-serif" }}>
            BEM-VINDO À MORIÁ
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-700">
            Um lugar de transformação, comunidade e fé. Fique por dentro das últimas notícias e eventos.
          </p>
        </div>

        {/* Feed de Notícias */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mockNews.map((newsItem) => (
            <NewsCard key={newsItem.id} news={newsItem} />
          ))}
        </div>
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
