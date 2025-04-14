import React, { useState } from 'react';

const ReseauNeurones = () => {
  // États pour suivre les interactions
  const [elementActif, setElementActif] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [modeGuide, setModeGuide] = useState(false);
  const [etapeGuide, setEtapeGuide] = useState(0);

  // Configuration des couleurs
  const couleurs = {
    entree: "#4299e1", // bleu
    cachee: "#805ad5", // violet
    sortie: "#38a169", // vert
    connexion: "#cbd5e0", // gris clair
    connexionActive: "#f56565", // rouge
    fond: "#f7fafc", // blanc cassé
    texte: "#2d3748", // gris foncé
    survol: "#fed7e2", // rose clair
  };

  // Définition des neurones et connexions
  const entreeNeurones = [
    { id: "e1", x: 100, y: 200, label: "Entrée 1" },
    { id: "e2", x: 100, y: 300, label: "Entrée 2" },
    { id: "e3", x: 100, y: 400, label: "Entrée 3" }
  ];
  
  const cacheNeurones = [
    { id: "c1", x: 300, y: 150, label: "Caché 1" },
    { id: "c2", x: 300, y: 275, label: "Caché 2" },
    { id: "c3", x: 300, y: 400, label: "Caché 3" },
    { id: "c4", x: 300, y: 525, label: "Caché 4" }
  ];
  
  const sortieNeurones = [
    { id: "s1", x: 500, y: 250, label: "Sortie 1" },
    { id: "s2", x: 500, y: 400, label: "Sortie 2" }
  ];

  // Définir toutes les connexions
  const genererConnexions = () => {
    const connexions = [];
    
    // Connexions entre entrée et couche cachée
    entreeNeurones.forEach(entree => {
      cacheNeurones.forEach(cache => {
        connexions.push({
          id: `${entree.id}-${cache.id}`,
          x1: entree.x, 
          y1: entree.y, 
          x2: cache.x, 
          y2: cache.y,
          from: 'entree',
          to: 'cachee',
          src: entree.id,
          dest: cache.id
        });
      });
    });
    
    // Connexions entre couche cachée et sortie
    cacheNeurones.forEach(cache => {
      sortieNeurones.forEach(sortie => {
        connexions.push({
          id: `${cache.id}-${sortie.id}`,
          x1: cache.x, 
          y1: cache.y, 
          x2: sortie.x, 
          y2: sortie.y,
          from: 'cachee',
          to: 'sortie',
          src: cache.id,
          dest: sortie.id
        });
      });
    });
    
    return connexions;
  };

  const connexions = genererConnexions();

  // Définir les chemins d'animation
  const cheminAnimation = [
    // Étape 1: Entrées activées
    { type: 'neurones', ids: ['e1', 'e2', 'e3'] },
    // Étape 2: Connexions vers la couche cachée
    { type: 'connexions', ids: connexions.filter(c => c.from === 'entree').map(c => c.id) },
    // Étape 3: Couche cachée activée
    { type: 'neurones', ids: ['c1', 'c2', 'c3', 'c4'] },
    // Étape 4: Connexions vers la sortie
    { type: 'connexions', ids: connexions.filter(c => c.from === 'cachee').map(c => c.id) },
    // Étape 5: Sortie activée
    { type: 'neurones', ids: ['s1', 's2'] }
  ];

  // Textes explicatifs
  const explications = {
    reseau: "Un réseau de neurones est un système qui imite la façon dont notre cerveau traite l'information. On le trouve dans de nombreuses technologies comme la reconnaissance vocale (assistants comme Siri), la traduction automatique, ou les suggestions de produits sur les sites d'achat.",
    entree: "Ces neurones reçoivent les informations brutes, comme votre téléphone qui capte votre voix ou votre visage. Dans notre exemple, ils détectent si l'animal est orange, a des rayures, ou des moustaches.",
    cachee: "C'est ici que la 'réflexion' se produit. Ces neurones combinent les informations simples pour créer des concepts plus complexes, comme 'ressemble à un chat' ou 'ressemble à un chien'.",
    sortie: "Ces neurones donnent la décision finale. Ils ne disent pas simplement 'chat' ou 'chien', mais plutôt 'chat à 90%' ou 'chien à 10%' pour exprimer leur niveau de certitude.",
    connexions: "L'information voyage par ces chemins. Au début, toutes les connexions sont aléatoires, puis elles se renforcent ou s'affaiblissent avec l'apprentissage, comme des sentiers qui deviennent plus visibles à force d'être empruntés.",
    neurone: "Chaque neurone est comme un petit décideur qui reçoit plusieurs informations, les évalue et envoie son propre signal. Plus il reçoit d'informations qui vont dans le même sens, plus son signal sera fort.",
    e1: "Entrée 1 : L'animal est-il orange ? (Oui)",
    e2: "Entrée 2 : L'animal a-t-il des rayures ? (Oui)",
    e3: "Entrée 3 : L'animal a-t-il des moustaches ? (Oui)",
    c1: "Combine 'orange' et 'rayures' → Indice fort pour 'chat'",
    c2: "Analyse la forme des moustaches → Typique d'un chat",
    c3: "Détecte une silhouette féline dans la combinaison des attributs",
    c4: "Vérifie les caractéristiques canines → Peu présentes",
    s1: "Résultat : 'Probabilité chat = 90%'",
    s2: "Résultat : 'Probabilité chien = 10%'"
  };
  
  // Textes du guide étape par étape
  const textesGuide = [
    "Bienvenue dans ce tour guidé ! Les réseaux de neurones sont au cœur des outils d'intelligence artificielle que vous utilisez chaque jour, comme la reconnaissance d'images ou les assistants vocaux.",
    "Tout commence à la COUCHE D'ENTRÉE. Ces neurones captent les informations brutes, comme les caractéristiques de notre animal : orange, rayé, avec des moustaches. C'est comme nos sens qui perçoivent le monde.",
    "Ces lignes sont des CONNEXIONS. Dans un réseau qui apprend, certaines connexions deviennent plus importantes que d'autres, comme votre cerveau qui renforce certains souvenirs en les répétant.",
    "La COUCHE CACHÉE est le cœur du système. Ces neurones combinent les caractéristiques simples pour former des concepts plus complexes. Par exemple, 'orange + rayures' pourrait activer fortement un 'détecteur de chat'.",
    "L'information continue son voyage à travers d'autres connexions, transportant maintenant des concepts plus élaborés vers la décision finale.",
    "La COUCHE DE SORTIE donne les résultats finaux : 'Chat : 90%, Chien : 10%'. Plus le réseau voit d'exemples, plus il devient précis dans ses prédictions, tout comme nous apprenons par l'expérience.",
    "Maintenant, voyons tout ce processus en action ! Cliquez sur 'Voir l'animation' pour observer comment l'information circule de l'entrée jusqu'à la sortie."
  ];

  // Animation du flux d'information
  const avancerAnimation = () => {
    if (animationStep < cheminAnimation.length - 1) {
      setAnimationStep(animationStep + 1);
    } else {
      // Ajouter un petit délai avant de terminer l'animation
      setTimeout(() => {
        setShowAnimation(false);
        setAnimationStep(0);
      }, 1500);
    }
  };

  const demarrerAnimation = () => {
    setShowAnimation(true);
    setAnimationStep(0);
    setElementActif(null);
    setModeGuide(false);
  };

  // Vérifier si un élément est actif dans l'animation actuelle
  const estActifDansAnimation = (type, id) => {
    if (!showAnimation) return false;
    
    const etapeActuelle = cheminAnimation[animationStep];
    return etapeActuelle.type === type && etapeActuelle.ids.includes(id);
  };

  // Gestion des interactions
  const handleMouseOver = (type, id) => {
    if (!modeGuide && !showAnimation) {
      setElementActif({ type, id });
    }
  };

  const handleMouseOut = () => {
    if (!modeGuide && !showAnimation) {
      setElementActif(null);
    }
  };

  const handleClick = (type, id) => {
    if (!modeGuide && !showAnimation) {
      if (elementActif && elementActif.type === type && elementActif.id === id) {
        setElementActif(null);
      } else {
        setElementActif({ type, id });
      }
    }
  };
  
  // Gestion du guide
  const demarrerGuide = () => {
    setModeGuide(true);
    setEtapeGuide(0);
    setElementActif(null);
    setShowAnimation(false);
  };
  
  const avancerGuide = () => {
    if (etapeGuide < textesGuide.length - 1) {
      setEtapeGuide(etapeGuide + 1);
      
      // Mettre en évidence les éléments correspondants selon l'étape
      if (etapeGuide === 0) { // Passer à l'étape 1 - entrées
        setElementActif({ type: 'entree', id: null });
      } else if (etapeGuide === 1) { // Passer à l'étape 2 - connexions entrée-cachée
        setElementActif({ type: 'connexion', id: 'connections-entree-cachee' });
      } else if (etapeGuide === 2) { // Passer à l'étape 3 - couche cachée
        setElementActif({ type: 'cachee', id: null });
      } else if (etapeGuide === 3) { // Passer à l'étape 4 - connexions cachée-sortie
        setElementActif({ type: 'connexion', id: 'connections-cachee-sortie' });
      } else if (etapeGuide === 4) { // Passer à l'étape 5 - sortie
        setElementActif({ type: 'sortie', id: null });
      } else if (etapeGuide === 5) { // Passer à l'étape 6 - guide complet
        setElementActif(null);
      }
    } else {
      terminerGuide();
    }
  };
  
  const terminerGuide = () => {
    setModeGuide(false);
    setElementActif(null);
  };

  // Rendu des neurones
  const rendreNeurone = (neurone, type) => {
    const couleurBase = couleurs[type];
    const estInteractif = elementActif && 
                         ((elementActif.type === 'neurone' && elementActif.id === neurone.id) || 
                          (elementActif.type === type));
    const estActif = estActifDansAnimation('neurones', neurone.id);
    
    const taille = 30;
    const couleurRemplissage = estActif ? couleurs.connexionActive : 
                              estInteractif ? couleurs.survol : 
                              couleurBase;
    
    const brillance = estInteractif || estActif ? 1.2 : 1;
    
    return (
      <g key={neurone.id} 
         onMouseOver={() => handleMouseOver('neurone', neurone.id)} 
         onMouseOut={handleMouseOut}
         onClick={() => handleClick('neurone', neurone.id)}
         style={{ cursor: 'pointer', filter: `brightness(${brillance})` }}>
        <circle 
          cx={neurone.x} 
          cy={neurone.y} 
          r={taille} 
          fill={couleurRemplissage} 
          stroke={couleurs.texte} 
          strokeWidth={estInteractif || estActif ? "3" : "2"}
        />
        <text 
          x={neurone.x} 
          y={neurone.y} 
          textAnchor="middle" 
          dominantBaseline="middle" 
          fill={couleurs.texte} 
          fontSize="14"
          fontWeight={estInteractif || estActif ? "bold" : "normal"}
        >
          {neurone.id}
        </text>
      </g>
    );
  };

  // Rendu des connexions
  const rendreConnexion = (connexion) => {
    const estInteractif = elementActif && 
                         ((elementActif.type === 'connexion' && elementActif.id === connexion.id) || 
                          (elementActif.type === 'connexion' && elementActif.id === 'connections-entree-cachee' && connexion.from === 'entree') ||
                          (elementActif.type === 'connexion' && elementActif.id === 'connections-cachee-sortie' && connexion.from === 'cachee'));
    const estActif = estActifDansAnimation('connexions', connexion.id);
    
    const epaisseur = estActif || estInteractif ? 3 : 1;
    const couleurLigne = estActif ? couleurs.connexionActive : 
                         estInteractif ? couleurs.survol : 
                         couleurs.connexion;
    
    // Animation de pulsation pour les connexions en mode guide
    const animationStyle = (estInteractif && modeGuide) ? { animation: 'pulse 1.5s infinite' } : {};
    
    return (
      <g key={connexion.id} 
         onMouseOver={() => handleMouseOver('connexion', connexion.id)} 
         onMouseOut={handleMouseOut}
         onClick={() => handleClick('connexion', connexion.id)}
         style={{ cursor: 'pointer', ...animationStyle }}>
        <line 
          x1={connexion.x1} 
          y1={connexion.y1} 
          x2={connexion.x2} 
          y2={connexion.y2} 
          stroke={couleurLigne} 
          strokeWidth={epaisseur}
          strokeOpacity={estInteractif || estActif ? 1 : 0.7}
        />
      </g>
    );
  };

  // Afficher les explications
  const afficherExplication = () => {
    // Si nous sommes en mode guide, afficher le texte de l'étape actuelle
    if (modeGuide) {
      return textesGuide[etapeGuide];
    }
    
    // Si nous sommes en animation
    if (showAnimation) {
      const etape = animationStep + 1;
      let explication = `Étape ${etape}/${cheminAnimation.length}: `;
      if (cheminAnimation[animationStep].type === 'neurones') {
        if (animationStep === 0) {
          explication += "Les informations entrent dans le réseau (par exemple : 'animal orange avec des rayures').";
        } else if (animationStep === 2) {
          explication += "Les neurones cachés combinent ces informations et détectent des motifs plus complexes.";
        } else if (animationStep === 4) {
          explication += "Le réseau donne sa réponse finale : 'C'est probablement un chat!'";
        }
      } else {
        explication += "L'information voyage à travers les connexions, comme des messages envoyés entre neurones.";
      }
      return explication;
    }
    
    // Pour l'interaction normale
    if (elementActif) {
      if (elementActif.type === 'neurone') {
        return explications[elementActif.id] || explications.neurone;
      } else if (elementActif.type === 'connexion') {
        return explications.connexions;
      } else if (elementActif.type === 'entree') {
        return explications.entree;
      } else if (elementActif.type === 'cachee') {
        return explications.cachee; 
      } else if (elementActif.type === 'sortie') {
        return explications.sortie;
      }
    }
    
    // Explication par défaut
    return explications.reseau;
  };

  // Rendu des groupes de neurones avec étiquettes
  const rendreGroupeNeurones = (neurones, type, label, x, y) => {
    const estInteractif = elementActif && elementActif.type === type;
    
    return (
      <g 
        onMouseOver={() => handleMouseOver(type, null)} 
        onMouseOut={handleMouseOut}
        onClick={() => handleClick(type, null)}
      >
        <text 
          x={x} 
          y={y} 
          textAnchor="middle" 
          fill={couleurs.texte}
          fontWeight={estInteractif ? "bold" : "normal"}
          fontSize={estInteractif ? "18" : "16"}
          style={{
            textShadow: estInteractif ? "0px 0px 3px rgba(0,0,0,0.2)" : "none",
            transition: "all 0.3s ease"
          }}
        >
          {label}
        </text>
        {neurones.map(neurone => rendreNeurone(neurone, type))}
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Réseau de Neurones Artificiel</h2>
      
      {/* Barre d'outils */}
      <div className="w-full flex justify-center mb-4 space-x-4">
        <button 
          onClick={demarrerGuide} 
          className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition-colors duration-300"
          disabled={modeGuide || showAnimation}
        >
          <span className="mr-2">📚</span> Visite guidée
        </button>
        
        <button 
          onClick={demarrerAnimation} 
          className="px-4 py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-600 transition-colors duration-300"
          disabled={showAnimation || modeGuide}
        >
          <span className="mr-2">▶️</span> Voir l'animation
        </button>
      </div>
      
      {/* Légende */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>Entrée</span>
        </div>
        <div className="flex items-center mr-4">
          <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
          <span>Couche cachée</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span>Sortie</span>
        </div>
      </div>
      
      {/* Exemple concret et contexte */}
      <div className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
        <p className="text-center mb-2">
          <span className="font-medium">Exemple concret: </span> 
          Notre réseau apprend à distinguer un chat d'un chien à partir de caractéristiques simples
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Applications réelles:</span> Ce même principe est utilisé dans les technologies que vous utilisez quotidiennement : reconnaissance faciale pour déverrouiller votre téléphone, assistants vocaux qui comprennent vos questions, ou systèmes qui vous recommandent des films.
        </p>
      </div>
      
      {/* Zone de visualisation */}
      <div className="relative w-full h-96 border border-gray-300 rounded bg-white overflow-hidden shadow-md">
        <svg width="100%" height="100%" viewBox="0 0 600 600">
          {/* Connexions */}
          {connexions.map(connexion => rendreConnexion(connexion))}
          
          {/* Groupes de neurones */}
          {rendreGroupeNeurones(entreeNeurones, 'entree', 'Couche d\'entrée', 100, 120)}
          {rendreGroupeNeurones(cacheNeurones, 'cachee', 'Couche cachée', 300, 80)}
          {rendreGroupeNeurones(sortieNeurones, 'sortie', 'Couche de sortie', 500, 180)}
        </svg>
        
        {/* Boutons pour l'animation ou le guide */}
        {showAnimation && (
          <button 
            onClick={avancerAnimation}
            className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          >
            Étape suivante →
          </button>
        )}
        
        {modeGuide && (
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button 
              onClick={terminerGuide}
              className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Quitter
            </button>
            <button 
              onClick={avancerGuide}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
            >
              Suivant →
            </button>
          </div>
        )}
      </div>
      
      {/* Zone d'explication */}
      <div className="w-full mt-4 p-4 bg-white border border-gray-300 rounded-lg min-h-32 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">
          {modeGuide ? 
            `Guide : Étape ${etapeGuide + 1}/${textesGuide.length}` :
            showAnimation ? 
              `Animation : Étape ${animationStep + 1}/${cheminAnimation.length}` :
              elementActif ?
                `${elementActif.type === 'neurone' ? `Neurone ${elementActif.id}` : 
                  elementActif.type === 'entree' ? 'Couche d\'entrée' :
                  elementActif.type === 'cachee' ? 'Couche cachée' :
                  elementActif.type === 'sortie' ? 'Couche de sortie' :
                  'Connexion'}` :
                "Comprendre un réseau de neurones"
          }
        </h3>
        <p className="text-lg">{afficherExplication()}</p>
        
        {!modeGuide && !showAnimation && !elementActif && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600 italic">
            Conseil : Pour mieux comprendre, commencez par la "Visite guidée" puis explorez en cliquant sur les différentes parties du réseau.
          </div>
        )}
      </div>
      
      {/* Instructions simplifiées et mini-FAQ */}
      <div className="w-full mt-4 p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Comment explorer ce schéma (3-5 minutes) :</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-3">
          <div className="flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full mr-2">👆</span>
            <span>Cliquez ou survolez les éléments pour les explorer</span>
          </div>
          <div className="flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full mr-2">📚</span>
            <span>Utilisez la "Visite guidée" pour une explication pas à pas</span>
          </div>
          <div className="flex items-center">
            <span className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-full mr-2">▶️</span>
            <span>Lancez l'animation pour voir le flux d'information</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-300">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Comment apprend-il ?</span> En voyant de nombreux exemples et en ajustant progressivement ses connexions, comme nous apprenons par l'expérience.
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Est-ce intelligent ?</span> C'est une forme d'intelligence, mais très spécialisée. Un réseau qui reconnaît des animaux ne peut pas conduire une voiture sans être complètement reprogrammé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReseauNeurones;
