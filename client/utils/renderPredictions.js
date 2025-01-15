const renderPredictions = (predictions, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "42px sans-serif";

    ctx.font = font;
    ctx.textBaseline = "top";
    predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction["bbox"];
        
        // Use a consistent color scheme for better visibility
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Label background
        ctx.fillStyle = "#FF0000";
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10);
        const padding = 4;
        ctx.fillRect(x, y - textHeight - padding, textWidth + padding * 2, textHeight + padding * 2);

        // Label text
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(prediction.class, x + padding, y - textHeight);
    });
}

export default renderPredictions;
