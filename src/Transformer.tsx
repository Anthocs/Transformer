import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Play, Pause, Info, X, Maximize, ZoomIn, Layers } from 'lucide-react';

const TransformerExplainer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [animationActive, setAnimationActive] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState('');
  
  // Pour l'animation automatique des connexions d'attention
  useEffect(() => {
    let interval;
    if (animationActive && activeStep === 1) {
      interval = setInterval(() => {
        setSelectedWord(prev => prev === null ? 0 : (prev + 1) % 5);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [animationActive, activeStep]);

  const handleStepChange = (step) => {
    setActiveStep(step);
    setAnimationActive(false);
    setSelectedWord(null);
    setShowTooltip(false);
  };
  
  const showInfoTooltip = (content, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height
    });
    setTooltipContent(content);
    setShowTooltip(true);
  };

  const renderAttentionDemo = () => {
    const words = ["Le", "chat", "mange", "une", "souris"];
    
    // Matrice des poids d'attention entre les mots
    const attentionWeights = [
      [0.1, 0.6, 0.1, 0.1, 0.1], // "Le" -> forte attention sur "chat"
      [0.1, 0.1, 0.5, 0.1, 0.2], // "chat" -> forte attention sur "mange"
      [0.1, 0.2, 0.1, 0.1, 0.5], // "mange" -> forte attention sur "souris"
      [0.1, 0.1, 0.1, 0.1, 0.6], // "une" -> forte attention sur "souris"
      [0.1, 0.1, 0.4, 0.1, 0.3]  // "souris" -> attention sur "mange" et lui-même
    ];
    
    return (
      <div className="flex flex-col items-center">
        {/* Bouton pour lancer/arrêter l'animation automatique */}
        <button
          className="mb-4 flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          onClick={() => setAnimationActive(!animationActive)}
        >
          {animationActive ? (
            <>
              <Pause size={16} className="mr-2" />
              Arrêter l'animation
            </>
          ) : (
            <>
              <Play size={16} className="mr-2" />
              Voir l'animation automatique
            </>
          )}
        </button>
        
        <div className="text-center mb-2 font-semibold">
          {animationActive 
            ? "Animation automatique en cours..." 
            : "Cliquez sur un mot pour voir ses connexions d'attention"}
        </div>
        
        {/* Mots sur lesquels on peut cliquer */}
        <div className="flex justify-center space-x-4 mb-6">
          {words.map((word, idx) => (
            <div
              key={idx}
              className={`px-4 py-2 text-lg rounded-lg cursor-pointer transition-all duration-300 ${
                selectedWord === idx 
                  ? 'bg-yellow-400 font-bold scale-110 shadow-lg' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => {
                setSelectedWord(idx);
                setAnimationActive(false);
              }}
            >
              {word}
            </div>
          ))}
        </div>
        
        {/* Visualisation des connexions d'attention */}
        <div className="w-full h-64 bg-blue-50 rounded-xl p-4 flex items-center justify-center relative">
          {selectedWord !== null ? (
            <div className="w-full h-full flex justify-center items-center">
              {/* Mots autour */}
              <div className="relative w-80 h-56">
                {/* Mot central (le mot sélectionné) */}
                <div 
                  className="absolute"
                  style={{ 
                    left: '50%', 
                    top: '50%', 
                    transform: 'translate(-50%, -50%)' 
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center font-bold shadow-lg z-10">
                    {words[selectedWord]}
                  </div>
                </div>
                
                {/* Autres mots disposés en cercle */}
                {words.map((word, idx) => {
                  if (idx === selectedWord) return null;
                  
                  // Disposer les mots en cercle autour du mot central
                  const angle = ((idx * (360 / (words.length - 0.5))) * Math.PI) / 180;
                  const radius = 100; // distance du centre
                  
                  const left = 140 + radius * Math.cos(angle);
                  const top = 80 + radius * Math.sin(angle);
                  
                  // Obtenir le poids d'attention
                  const weight = attentionWeights[selectedWord][idx];
                  
                  return (
                    <React.Fragment key={idx}>
                      {/* Ligne d'attention */}
                      <svg 
                        className="absolute w-full h-full top-0 left-0 pointer-events-none" 
                        style={{ overflow: 'visible' }}
                      >
                        <line
                          x1="140"
                          y1="80"
                          x2={left}
                          y2={top}
                          stroke="#3B82F6"
                          strokeWidth={Math.max(1, weight * 12)}
                          opacity={Math.max(0.3, weight)}
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      {/* Mot */}
                      <div 
                        className={`absolute w-14 h-14 rounded-full flex items-center justify-center 
                          ${weight > 0.4 ? 'bg-blue-200 shadow font-semibold' : 'bg-gray-200'}`}
                        style={{ 
                          left: left - 25, 
                          top: top - 25,
                          transition: 'all 0.3s ease-in-out'
                        }}
                      >
                        {word}
                      </div>
                    </React.Fragment>
                  );
                })}
                
                {/* Légende des poids d'attention */}
                <div className="absolute bottom-0 w-full flex justify-center">
                  <div className="flex items-center space-x-3 bg-white px-3 py-1 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-6 h-2 bg-blue-500 opacity-30 rounded"></div>
                      <span className="ml-1 text-xs">Faible</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-2 bg-blue-500 opacity-60 rounded"></div>
                      <span className="ml-1 text-xs">Moyenne</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-2 bg-blue-500 opacity-100 rounded"></div>
                      <span className="ml-1 text-xs">Forte</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              <p>Sélectionnez un mot pour voir ses connexions d'attention</p>
            </div>
          )}
          
          {/* Bouton Info */}
          <button 
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
            onClick={(e) => showInfoTooltip("Le mécanisme d'attention permet à chaque mot de \"regarder\" d'autres mots pour mieux comprendre le contexte. Plus la connexion est forte, plus l'influence est importante.", e)}
          >
            <Info size={14} />
          </button>
        </div>
      </div>
    );
  };
  
  const renderQKVDemo = () => {
    return (
      <div className="relative w-full bg-blue-50 rounded-xl p-4 h-64 flex items-center justify-center">
        <div className="absolute top-2 left-4 font-semibold">L'attention en 3 étapes</div>
        
        <div className="flex space-x-8">
          {/* Query */}
          <div className="relative w-24 flex flex-col items-center">
            <div 
              className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-400 shadow-md"
              onMouseEnter={(e) => showInfoTooltip("Query (Q): \"Que cherche-t-on?\". Chaque mot formule une requête pour trouver les mots pertinents.", e)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="font-bold text-red-600 text-lg">Q</span>
            </div>
            <div className="mt-2 text-center">
              <div className="font-semibold">Query</div>
              <div className="text-xs text-gray-600">Requête</div>
            </div>
            <svg className="absolute -right-6 top-8 w-8 h-8" viewBox="0 0 24 24">
              <path d="M5 12h14" stroke="#777" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 5l7 7-7 7" stroke="#777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          {/* Key */}
          <div className="relative w-24 flex flex-col items-center">
            <div 
              className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-400 shadow-md"
              onMouseEnter={(e) => showInfoTooltip("Key (K): \"Où chercher?\". Chaque mot fournit une clé qui peut correspondre aux requêtes des autres mots.", e)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="font-bold text-blue-600 text-lg">K</span>
            </div>
            <div className="mt-2 text-center">
              <div className="font-semibold">Key</div>
              <div className="text-xs text-gray-600">Clé</div>
            </div>
            <svg className="absolute -right-6 top-8 w-8 h-8" viewBox="0 0 24 24">
              <path d="M5 12h14" stroke="#777" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 5l7 7-7 7" stroke="#777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          {/* Value */}
          <div className="w-24 flex flex-col items-center">
            <div 
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-400 shadow-md"
              onMouseEnter={(e) => showInfoTooltip("Value (V): \"Quoi utiliser?\". Les informations pertinentes que chaque mot apporte.", e)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className="font-bold text-green-600 text-lg">V</span>
            </div>
            <div className="mt-2 text-center">
              <div className="font-semibold">Value</div>
              <div className="text-xs text-gray-600">Valeur</div>
            </div>
          </div>
        </div>
        
        {/* Flèche descendante vers le résultat */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <svg width="30" height="24">
            <path d="M15,0 L30,0 L15,24 L0,0 Z" fill="#3B82F6" />
          </svg>
        </div>
        
        {/* Résultat */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 px-4 py-2 rounded-lg border border-yellow-400">
          <span className="font-semibold">Attention totale</span>
        </div>
      </div>
    );
  };
  
  const renderComparisonDemo = () => {
    return (
      <div className="relative w-full bg-gray-50 rounded-xl p-4 h-72 flex flex-col items-center justify-center">
        <h3 className="absolute top-2 left-4 font-semibold">Avant vs Après</h3>
        
        {/* Comparaison visuelle */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-md">
          {/* Avant: Modèle séquentiel */}
          <div>
            <div className="text-center font-bold mb-2 text-red-700">Modèles précédents</div>
            <div className="bg-red-50 rounded-lg p-3 h-48 flex flex-col items-center justify-center relative border border-red-200">
              {/* Animation séquentielle */}
              <div className="space-y-2 w-full">
                <div className="flex space-x-1 justify-center relative">
                  <div className="absolute -left-6 top-1 text-xs text-gray-500">Étape 1</div>
                  {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                    <div 
                      key={idx}
                      className={`px-2 py-1 rounded-md text-xs ${idx === 0 ? 'bg-red-300 font-semibold' : 'bg-gray-200'}`}
                    >
                      {word}
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-1 justify-center relative">
                  <div className="absolute -left-6 top-1 text-xs text-gray-500">Étape 2</div>
                  {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                    <div 
                      key={idx}
                      className={`px-2 py-1 rounded-md text-xs ${idx === 1 ? 'bg-red-300 font-semibold' : 'bg-gray-200'}`}
                    >
                      {word}
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-1 justify-center relative">
                  <div className="absolute -left-6 top-1 text-xs text-gray-500">Étape 3</div>
                  {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                    <div 
                      key={idx}
                      className={`px-2 py-1 rounded-md text-xs ${idx === 2 ? 'bg-red-300 font-semibold' : 'bg-gray-200'}`}
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="absolute bottom-2 w-full px-2">
                <div className="flex justify-between text-xs text-red-800 bg-red-100 p-1 rounded-lg">
                  <span>Traitement séquentiel</span>
                  <span className="font-semibold">Lent</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transformer */}
          <div>
            <div className="text-center font-bold mb-2 text-green-700">Transformer</div>
            <div className="bg-green-50 rounded-lg p-3 h-48 flex flex-col items-center justify-center relative border border-green-200">
              {/* Mots et connexions */}
              <div className="relative w-full h-32">
                <div className="absolute inset-4">
                  <div className="flex justify-center space-x-1 mb-4">
                    {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                      <div key={idx} className="px-2 py-1 text-xs rounded-md bg-green-300 font-semibold">
                        {word}
                      </div>
                    ))}
                  </div>
                  
                  {/* Lignes d'attention animées */}
                  <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 200 60">
                    <g strokeLinecap="round" fill="none">
                      <path 
                        d="M34,12 Q60,30 85,12" 
                        stroke="#22C55E" 
                        strokeWidth="1"
                      >
                        <animate
                          attributeName="stroke-width"
                          values="1;2;1"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </path>
                      <path 
                        d="M34,12 Q70,40 136,12" 
                        stroke="#22C55E" 
                        strokeWidth="1"
                      >
                        <animate
                          attributeName="stroke-width"
                          values="1;2;1"
                          dur="2.7s"
                          repeatCount="indefinite"
                        />
                      </path>
                      <path 
                        d="M85,12 Q110,30 136,12" 
                        stroke="#22C55E" 
                        strokeWidth="1"
                      >
                        <animate
                          attributeName="stroke-width"
                          values="1;2.5;1"
                          dur="2.3s"
                          repeatCount="indefinite"
                        />
                      </path>
                      <path 
                        d="M136,12 Q160,30 187,12" 
                        stroke="#22C55E" 
                        strokeWidth="1"
                      >
                        <animate
                          attributeName="stroke-width"
                          values="1;3;1"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </path>
                      <path 
                        d="M85,12 Q120,40 187,12" 
                        stroke="#22C55E" 
                        strokeWidth="1"
                      >
                        <animate
                          attributeName="stroke-width"
                          values="1;2;1"
                          dur="3.2s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  </svg>
                </div>
              </div>
              
              <div className="absolute bottom-2 w-full px-2">
                <div className="flex justify-between text-xs text-green-800 bg-green-100 p-1 rounded-lg">
                  <span>Traitement parallèle</span>
                  <span className="font-semibold">Rapide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 w-full max-w-md">
          <div className="bg-blue-100 p-2 rounded-lg shadow-sm">
            <div className="flex justify-around text-xs font-semibold">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                Traitement simultané
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                Relations à longue distance
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                Meilleure précision
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const steps = [
    // Étape 1: Vue d'ensemble du Transformer
    {
      title: "Le modèle Transformer",
      render: () => (
        <div className="flex flex-col items-center">
          {/* Explication introductive */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4 w-full">
            <h3 className="font-bold text-blue-700 mb-2">Qu'est-ce qu'un Transformer ?</h3>
            <p className="text-sm mb-3">
              Le Transformer est un modèle d'intelligence artificielle qui a révolutionné le traitement 
              du langage naturel en 2017. Il permet notamment de réaliser des traductions, des résumés,
              ou de générer du texte comme le fait ChatGPT.
            </p>
          </div>
          
          {/* Schéma simplifié et clarifié */}
          <div className="relative w-full bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <h3 className="text-center font-semibold mb-5 text-gray-700">Comment fonctionne un Transformer ?</h3>
            
            {/* Séquence d'entrée */}
            <div className="flex flex-col items-center mb-8">
              <div className="text-sm font-medium text-gray-600 mb-2">Phrase d'entrée :</div>
              <div className="flex space-x-2">
                {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                  <div key={idx} className="px-3 py-2 bg-green-100 rounded-lg border border-green-300 shadow-sm font-medium">
                    {word}
                  </div>
                ))}
              </div>
              <div className="h-8 relative w-full flex justify-center items-center">
                <svg width="30" height="30">
                  <path d="M15,0 L30,15 L0,15 Z" fill="#3B82F6" />
                </svg>
              </div>
            </div>
            
            {/* TRANSFORMER avec légende */}
            <div className="relative bg-blue-50 rounded-lg border border-blue-300 p-4 mb-8 shadow-md">
              <div className="flex justify-between items-center mb-5">
                <div className="font-bold text-lg text-blue-800">TRANSFORMER</div>
                <div className="bg-yellow-100 px-3 py-1 rounded-lg border border-yellow-300 text-sm font-medium">
                  Innovation principale
                </div>
              </div>
              
              {/* 2 caractéristiques clés */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="font-medium text-blue-700 mb-1 text-sm">1. Traitement parallèle</div>
                  <div className="flex justify-center space-x-1 mb-2">
                    {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                      <div key={idx} className="px-1 py-1 bg-blue-100 rounded-md text-xs">
                        {word}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    Traite tous les mots <strong>en même temps</strong>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="font-medium text-blue-700 mb-1 text-sm">2. Mécanisme d'attention</div>
                  <div className="flex justify-center relative h-16">
                    <svg width="150" height="50" className="mt-1">
                      {/* Cercles représentant les mots */}
                      <circle cx="20" cy="25" r="5" fill="#4B5563" />
                      <circle cx="50" cy="25" r="5" fill="#4B5563" />
                      <circle cx="80" cy="25" r="5" fill="#4B5563" />
                      <circle cx="110" cy="25" r="5" fill="#4B5563" />
                      <circle cx="140" cy="25" r="5" fill="#4B5563" />
                      
                      {/* Lignes d'attention */}
                      <path d="M20,25 C35,10 65,10 80,25" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
                      <path d="M50,25 C65,40 95,40 110,25" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
                      <path d="M80,25 C95,10 125,10 140,25" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    Chaque mot <strong>fait attention</strong> aux autres mots
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-100 p-2 rounded-lg">
                <strong>Ce qu'il fait :</strong> Le Transformer analyse les relations entre tous les mots 
                pour comprendre le sens de la phrase et produire un résultat adapté.
              </div>
            </div>
            
            {/* Séquence de sortie */}
            <div className="flex flex-col items-center">
              <div className="h-8 relative w-full flex justify-center items-center">
                <svg width="30" height="30">
                  <path d="M15,15 L30,0 L0,0 Z" fill="#3B82F6" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-600 mb-2">Résultat (ex: traduction) :</div>
              <div className="flex space-x-2">
                {["The", "cat", "eats", "a", "mouse"].map((word, idx) => (
                  <div key={idx} className="px-3 py-2 bg-purple-100 rounded-lg border border-purple-300 shadow-sm font-medium">
                    {word}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Explication de l'innovation clé */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4 w-full">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-yellow-700 mr-2 flex-shrink-0">!</div>
              <p className="text-sm">
                <strong>L'innovation révolutionnaire :</strong> Avant les Transformers, les modèles traitaient les mots un par un, 
                comme lire une phrase mot après mot. Le Transformer peut voir toute la phrase en même temps et 
                comprendre comment chaque mot se rapporte aux autres, peu importe leur position dans la phrase.
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
              onClick={() => handleStepChange(1)}
            >
              <ZoomIn size={16} className="mr-2" />
              Explorer le mécanisme d'attention
            </button>
          </div>
        </div>
      )
    },
    
    // Étape 2: Le mécanisme d'attention en détail
    {
      title: "Mécanisme d'attention",
      render: () => (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <button
              className={`px-3 py-1 rounded-lg ${activeStep === 1 ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100'}`}
              onClick={() => renderAttentionDemo()}
            >
              Connexions d'attention
            </button>
            
            <button
              className={`px-3 py-1 rounded-lg ${activeStep === 2 ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100'}`}
              onClick={() => renderQKVDemo()}
            >
              Query-Key-Value
            </button>
          </div>
          
          {renderAttentionDemo()}
          
          <div className="px-4 py-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm">
            <div className="font-semibold">Pourquoi c'est important :</div>
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>Chaque mot "fait attention" à tous les autres mots simultanément</li>
              <li>Permet de comprendre le contexte et les relations entre mots distants</li>
              <li>Le modèle décide quels mots sont importants pour comprendre le sens</li>
            </ul>
          </div>
        </div>
      )
    },
    
    // Étape 3: Query-Key-Value expliqué simplement
    {
      title: "Comment fonctionne l'attention ?",
      render: () => (
        <div className="flex flex-col space-y-4">
          {/* Introduction simple */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 w-full">
            <h3 className="font-bold text-blue-700 mb-2">Le mécanisme d'attention expliqué simplement</h3>
            <p className="text-sm">
              Le mécanisme d'attention fonctionne comme un système de <strong>questions-réponses</strong> entre 
              les mots d'une phrase. Voici comment cela fonctionne avec un exemple concret :
            </p>
          </div>
          
          {/* Exemple concret avec une phrase */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 w-full">
            <div className="text-center font-medium mb-4">Prenons la phrase : "Le chat mange une souris"</div>
            
            {/* 1. Étape Query - Question */}
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                  <span className="font-bold text-red-600">Q</span>
                </div>
                <h4 className="font-semibold">QUERY = QUESTION</h4>
              </div>
              
              <div className="flex items-start">
                <div className="mr-3 mt-2">
                  <div className="bg-red-200 px-3 py-2 rounded-lg font-medium">chat</div>
                </div>
                <div>
                  <p className="text-sm mb-2">Le mot "chat" pose des questions aux autres mots :</p>
                  <ul className="text-xs list-disc pl-4 space-y-1">
                    <li>"Quels mots sont importants pour comprendre mon rôle dans la phrase ?"</li>
                    <li>"À qui ou quoi suis-je relié ?"</li>
                  </ul>
                  <div className="mt-2 text-sm flex items-center">
                    <span className="font-medium">En langage simple :</span>
                    <span className="ml-2 italic bg-red-100 px-2 py-1 rounded">Que cherche-t-on à savoir ?</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 2. Étape Key - Clé */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="font-bold text-blue-600">K</span>
                </div>
                <h4 className="font-semibold">KEY = CLÉ</h4>
              </div>
              
              <div className="flex items-start">
                <div className="flex flex-col space-y-2 mr-3 mt-1">
                  <div className="bg-gray-200 px-2 py-1 rounded">Le</div>
                  <div className="bg-blue-200 px-2 py-1 rounded font-medium">mange</div>
                  <div className="bg-gray-200 px-2 py-1 rounded">une</div>
                  <div className="bg-blue-200 px-2 py-1 rounded font-medium">souris</div>
                </div>
                <div>
                  <p className="text-sm mb-2">Chaque mot fournit une "clé" pour répondre aux questions :</p>
                  <ul className="text-xs list-disc pl-4 space-y-1">
                    <li>Les mots "mange" et "souris" sont fortement liés au "chat"</li>
                    <li>Le modèle calcule un <strong>score d'attention</strong> entre chaque paire de mots</li>
                  </ul>
                  <div className="mt-2 text-sm flex items-center">
                    <span className="font-medium">En langage simple :</span>
                    <span className="ml-2 italic bg-blue-100 px-2 py-1 rounded">Qui peut répondre à mes questions ?</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 3. Étape Value - Valeur */}
            <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <span className="font-bold text-green-600">V</span>
                </div>
                <h4 className="font-semibold">VALUE = VALEUR</h4>
              </div>
              
              <div className="flex items-start">
                <div className="flex flex-col space-y-2 mr-3 mt-1">
                  <div className="bg-gray-200 px-2 py-1 rounded opacity-50">Le</div>
                  <div className="bg-green-200 px-2 py-1 rounded font-medium">mange</div>
                  <div className="bg-gray-200 px-2 py-1 rounded opacity-50">une</div>
                  <div className="bg-green-200 px-2 py-1 rounded font-medium">souris</div>
                </div>
                <div>
                  <p className="text-sm mb-2">Le chat "collecte" les informations des mots pertinents :</p>
                  <ul className="text-xs list-disc pl-4 space-y-1">
                    <li>Il récupère principalement les informations de "mange" et "souris"</li>
                    <li>Ces informations l'aident à comprendre sa fonction (sujet qui mange)</li>
                  </ul>
                  <div className="mt-2 text-sm flex items-center">
                    <span className="font-medium">En langage simple :</span>
                    <span className="ml-2 italic bg-green-100 px-2 py-1 rounded">Quelles informations importantes je récupère ?</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 4. Résultat final */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-center mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                  <span className="font-bold text-yellow-600">=</span>
                </div>
                <h4 className="font-semibold">RÉSULTAT</h4>
              </div>
              
              <div className="text-center mb-2">
                <p className="text-sm">Le mot "chat" a maintenant une représentation enrichie qui inclut :</p>
              </div>
              
              <div className="flex justify-center space-x-2 mb-2">
                <div className="bg-purple-100 px-3 py-2 rounded-lg">
                  <span className="font-medium">chat</span>
                  <span className="text-xs ml-1">+ contexte</span>
                </div>
                <svg width="30" height="24" className="mt-1">
                  <path d="M5 12h20" stroke="#777" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 5l7 7-7 7" stroke="#777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="bg-purple-200 px-3 py-2 rounded-lg">
                  <span className="font-medium">"animal qui mange une souris"</span>
                </div>
              </div>
              
              <p className="text-xs text-center">
                Le modèle comprend maintenant que "chat" n'est pas juste un mot isolé, 
                mais le sujet qui réalise l'action de manger une souris.
              </p>
            </div>
          </div>
          
          {/* Analogie finale */}
          <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 w-full">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700 mr-2 flex-shrink-0">i</div>
              <p className="text-sm">
                <strong>Analogie :</strong> Imaginez une réunion où chaque participant (mot) pose des questions, 
                décide à qui prêter attention, et rassemble des informations importantes pour comprendre le sujet global.
                C'est ainsi que les mots "communiquent" entre eux dans un Transformer !
              </p>
            </div>
          </div>
          
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center self-center"
            onClick={() => handleStepChange(3)}
          >
            Voir la comparaison avec les modèles précédents
          </button>
        </div>
      )
    },
    
    // Étape 4: Comparaison avec les modèles précédents
    {
      title: "La révolution Transformer",
      render: () => (
        <div className="flex flex-col space-y-4">
          {/* Explication de la révolution */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4 w-full">
            <h3 className="font-bold text-blue-700 mb-2">Pourquoi les Transformers ont révolutionné l'IA</h3>
            <p className="text-sm mb-2">
              Avant les Transformers, les modèles de traitement du langage (comme les RNN et LSTM) 
              traitaient les mots <strong>un par un</strong>, ce qui posait plusieurs problèmes :
            </p>
            <ul className="list-disc pl-5 text-sm space-y-1 mb-2">
              <li>Lenteur du traitement séquentiel</li>
              <li>Difficulté à gérer les phrases longues</li>
              <li>Perte d'informations entre les mots distants</li>
            </ul>
            <p className="text-sm">
              Le Transformer a résolu ces problèmes grâce au <strong>traitement parallèle</strong> et 
              au <strong>mécanisme d'attention</strong>.
            </p>
          </div>
          
          {/* Démo de comparaison avec taille ajustée pour éviter les débordements */}
          <div className="relative w-full bg-gray-50 rounded-xl p-4 h-80 flex flex-col items-center justify-center">
            <h3 className="absolute top-2 left-4 font-semibold">Avant vs Après</h3>
            
            {/* Comparaison visuelle avec espacement ajusté */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {/* Avant: Modèle séquentiel */}
              <div>
                <div className="text-center font-bold mb-2 text-red-700">Modèles précédents</div>
                <div className="bg-red-50 rounded-lg p-3 h-40 flex flex-col items-center justify-center relative border border-red-200">
                  {/* Animation séquentielle avec taille réduite */}
                  <div className="space-y-2 w-full">
                    <div className="flex space-x-1 justify-center relative">
                      <div className="absolute -left-4 top-1 text-xs text-gray-500">1</div>
                      {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                        <div 
                          key={idx}
                          className={`px-1 py-1 rounded-md text-xs ${idx === 0 ? 'bg-red-300 font-semibold' : 'bg-gray-200'}`}
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-1 justify-center relative">
                      <div className="absolute -left-4 top-1 text-xs text-gray-500">2</div>
                      {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                        <div 
                          key={idx}
                          className={`px-1 py-1 rounded-md text-xs ${idx === 1 ? 'bg-red-300 font-semibold' : 'bg-gray-200'}`}
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-1 justify-center relative">
                      <div className="absolute -left-4 top-1 text-xs text-gray-500">3</div>
                      {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                        <div 
                          key={idx}
                          className={`px-1 py-1 rounded-md text-xs ${idx === 2 ? 'bg-red-300 font-semibold' : 'bg-gray-200'}`}
                        >
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 w-full px-2">
                    <div className="flex justify-between text-xs text-red-800 bg-red-100 p-1 rounded-lg">
                      <span>Traitement séquentiel</span>
                      <span className="font-semibold">Lent</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Transformer */}
              <div>
                <div className="text-center font-bold mb-2 text-green-700">Transformer</div>
                <div className="bg-green-50 rounded-lg p-3 h-40 flex flex-col items-center justify-center relative border border-green-200">
                  {/* Visualisation simplifiée du traitement parallèle */}
                  <div className="w-full flex justify-center">
                    <div className="flex space-x-1 mb-2">
                      {["Le", "chat", "mange", "une", "souris"].map((word, idx) => (
                        <div key={idx} className="px-1 py-1 text-xs rounded-md bg-green-300 font-semibold">
                          {word}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* SVG avec dimensions réduites pour éviter les débordements */}
                  <svg className="w-full h-16" viewBox="0 0 200 60" preserveAspectRatio="xMidYMid meet">
                    <g strokeLinecap="round" fill="none">
                      <path d="M34,12 Q60,30 85,12" stroke="#22C55E" strokeWidth="1">
                        <animate attributeName="stroke-width" values="1;2;1" dur="3s" repeatCount="indefinite" />
                      </path>
                      <path d="M34,12 Q70,40 136,12" stroke="#22C55E" strokeWidth="1">
                        <animate attributeName="stroke-width" values="1;2;1" dur="2.7s" repeatCount="indefinite" />
                      </path>
                      <path d="M85,12 Q110,30 136,12" stroke="#22C55E" strokeWidth="1">
                        <animate attributeName="stroke-width" values="1;2.5;1" dur="2.3s" repeatCount="indefinite" />
                      </path>
                      <path d="M136,12 Q160,30 187,12" stroke="#22C55E" strokeWidth="1">
                        <animate attributeName="stroke-width" values="1;3;1" dur="2.5s" repeatCount="indefinite" />
                      </path>
                      <path d="M85,12 Q120,40 187,12" stroke="#22C55E" strokeWidth="1">
                        <animate attributeName="stroke-width" values="1;2;1" dur="3.2s" repeatCount="indefinite" />
                      </path>
                    </g>
                  </svg>
                  
                  <div className="absolute bottom-2 w-full px-2">
                    <div className="flex justify-between text-xs text-green-800 bg-green-100 p-1 rounded-lg">
                      <span>Traitement parallèle</span>
                      <span className="font-semibold">Rapide</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Explication des avantages */}
            <div className="mt-4 w-full max-w-md">
              <div className="bg-blue-100 p-2 rounded-lg shadow-sm">
                <div className="text-center text-xs font-semibold mb-1">Avantages clés du Transformer</div>
                <div className="flex justify-around text-xs">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    Traitement simultané
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    Relations à longue distance
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    Meilleure précision
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Applications */}
          <div className="px-4 py-3 bg-green-50 rounded-lg border border-green-200 text-sm">
            <div className="font-semibold mb-2">Applications des Transformers :</div>
            <p className="text-xs mb-2">Les Transformers sont à la base de nombreux systèmes d'IA modernes :</p>
            <div className="flex justify-around">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="font-bold text-green-800">GPT</span>
                </div>
                <span className="text-xs mt-1">ChatGPT</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-800">BERT</span>
                </div>
                <span className="text-xs mt-1">Google Search</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="font-bold text-purple-800">T5</span>
                </div>
                <span className="text-xs mt-1">Traduction</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      handleStepChange(activeStep + 1);
    }
  };
  
  const prevStep = () => {
    if (activeStep > 0) {
      handleStepChange(activeStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* En-tête avec titre d'étape */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 flex justify-between items-center">
        <h2 className="text-lg font-bold">{steps[activeStep].title}</h2>
        <div className="text-sm font-medium">
          Étape {activeStep + 1}/{steps.length}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {steps[activeStep].render()}
        
        {/* Navigation buttons */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeStep === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            <ArrowLeft size={16} className="mr-1" />
            Précédent
          </button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => handleStepChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-blue-500 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Étape ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={nextStep}
            disabled={activeStep === steps.length - 1}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeStep === steps.length - 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Suivant
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
      
      {/* Info tooltip */}
      {showTooltip && (
        <div 
          className="fixed bg-black bg-opacity-80 text-white p-3 rounded-lg shadow-lg z-50 max-w-xs text-sm"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y + 10}px`,
            transform: 'translateX(-50%)'
          }}
        >
          {tooltipContent}
          <button 
            className="absolute top-1 right-1 text-white opacity-70 hover:opacity-100"
            onClick={() => setShowTooltip(false)}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TransformerExplainer;
