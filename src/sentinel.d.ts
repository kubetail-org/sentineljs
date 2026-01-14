export function on(cssSelectors: string | string[], callback: (arg0: HTMLElement) => void): void;
export function off(cssSelectors: string | string[], callback?: (arg0: HTMLElement) => void): void;
export function reset(): void;
export default sentinel;
declare namespace sentinel {
    export { on };
    export { off };
    export { reset };
}
