import React, { createContext, useContext, useState, useEffect } from 'react';

// Creamos el contexto global
const GlobalContext = createContext();

// Creamos un proveedor para el contexto global
export const GlobalProvider = ({ children }) => {
  const [historias, setHistorias] = useState([]); // Estado para almacenar las historias
  const [dataHistoria, setDataHistoria] = useState(null); // Estado para la historia seleccionada

  // Cargar los datos de bd.json al montar el componente
  useEffect(() => {
    fetch('http://localhost:3000/historias')
      .then(response => response.json())
      .then(data => setHistorias(data))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  const updateHistoria = (updatedHistoria) => {
    setHistorias((prevHistorias) =>
      prevHistorias.map((historia) =>
        historia.id === updatedHistoria.id ? updatedHistoria : historia
      )
    );
  };

  const addHistoria = (newHistoria) => {
    newHistoria.id = Date.now(); // Asigna un ID único
    setHistorias((prevHistorias) => [...prevHistorias, newHistoria]);
  };

  return (
    <GlobalContext.Provider value={{ historias, dataHistoria, setDataHistoria, updateHistoria, addHistoria }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook personalizado para utilizar el contexto global
export const useGlobalContext = () => useContext(GlobalContext);
