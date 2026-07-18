window.storage = {
  get(key, fallbackValue = null) {
    try {
      const savedValue = localStorage.getItem(key);

      if (savedValue === null) {
        return fallbackValue;
      }

      return JSON.parse(savedValue);
    } catch (error) {
      console.error(`Erro ao ler a chave "${key}" do localStorage:`, error);

      return fallbackValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      return true;
    } catch (error) {
      console.error(`Erro ao salvar a chave "${key}" no localStorage:`, error);

      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);

      return true;
    } catch (error) {
      console.error(`Erro ao remover a chave "${key}" do localStorage:`, error);

      return false;
    }
  },
};
