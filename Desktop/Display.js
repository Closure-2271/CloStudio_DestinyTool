import electron from 'electron';
const { screen } = electron;


export function getWindowSize() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const windowWidth = Math.floor(width * 0.4);
    const windowHeight = Math.floor(height * 0.6);

    return {
        width: windowWidth,
        height: windowHeight,
        minWidth: 1000,
        minHeight: 1600
    };
}
