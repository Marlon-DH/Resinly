// Mock leve do cliente Supabase usado para desenvolvimento local
// Não altera layout — fornece as APIs mínimas esperadas pelos componentes
// Para usar o Supabase real, instale @supabase/supabase-js e substitua este arquivo.

const supabase = {
  auth: {
    async getSession() {
      return { data: { session: null } };
    },
    onAuthStateChange(callback: any) {
      const subscription = {
        unsubscribe: () => {},
      };

      // Call callback asynchronously with null session to mimic client behavior
      setTimeout(() => callback("INITIAL", null), 0);

      return { data: { subscription } };
    },
    async signInWithOAuth() {
      return { error: null };
    },
    async signOut() {
      return { error: null };
    },
  },
  from(_table: string) {
    const chainable: any = {
      _table,
      _selectCols: "*",
      select(cols?: string) {
        if (cols) chainable._selectCols = cols;
        return chainable;
      },
      eq() {
        return chainable;
      },
      order() {
        return chainable;
      },
      async insert(_rec: any) {
        return { error: null };
      },
      // Final executor when awaited: return empty data array
      async then(resolve: any) {
        // allow awaiting chainable directly (await chainable)
        return resolve({ data: [], error: null });
      },
      // Support await supabase.from(...).select(...).eq(...).order(...)
      async execute() {
        return { data: [], error: null };
      },
    };

    return chainable;
  },
};

export { supabase };
