export default class Creator {
  public static canvas: HTMLCanvasElement = document.getElementById(
    'canvas',
  ) as HTMLCanvasElement;
  public static context: CanvasRenderingContext2D = Creator.canvas.getContext(
    '2d',
  ) as CanvasRenderingContext2D;

  public static hCanvas: HTMLCanvasElement = document.getElementById(
    'hidden-canvas',
  ) as HTMLCanvasElement;
  public static hContext: CanvasRenderingContext2D = Creator.hCanvas.getContext(
    '2d',
  ) as CanvasRenderingContext2D;

  static init() {
    Creator.resizeCanvas();
    window.addEventListener('resize', Creator.resizeCanvas);
  }

  private static resizeCanvas() {
    const container = document.getElementById(
      'canvas-container',
    ) as HTMLDivElement;

    Creator.canvas.height = container.clientHeight;
    Creator.canvas.width = container.clientWidth;

    Creator.hCanvas.height = Creator.canvas.height * 2;
    Creator.hCanvas.width = Creator.canvas.width * 2;
  }
}
