/**
 * Wrapper ligero para la función fetch global.
 * Permite mockear las llamadas externas en los tests usando vi.mock().
 */
export const fetch = globalThis.fetch;
