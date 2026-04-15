"use client";

// Todo list: make sure that the parking lot have intersections with stop signs, crosswalks, and directional arrows. Add some landscaping elements like islands with trees. Consider adding a speed bump near the entrance for realism.
import { useEffect, useRef } from "react";

export interface ParkingLotCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export function ParkingLotCanvas({ width = 1000, height = 600, className }: ParkingLotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    // Colors
    const asphalt = "#6b7280";
    const grass = "#cbce8c";
    const sidewalk = "#d1d5db";
    const white = "#ffffff";
    const hcBlue = "#3b82f6";
    const building = "#9ca3af";
    const stopRed = "#dc2626";
    const crosswalkYellow = "#fcd34d";
    const islandGreen = "#a3e635";
    const treeGreen = "#166534";

    // Layout constants
    const lotLeft = 150;
    const lotTop = 30;
    const lotRight = W - 30;
    const lotBottom = H - 30;
    const spotW = 28;
    const spotH = 50;
    const aisleH = 60;

    // Green grass background
    ctx.fillStyle = grass;
    ctx.fillRect(0, 0, W, H);

    // Main asphalt area
    ctx.fillStyle = asphalt;
    ctx.fillRect(lotLeft, lotTop, lotRight - lotLeft, lotBottom - lotTop);

    // Shopping center building on left
    ctx.fillStyle = building;
    ctx.fillRect(10, 80, 120, H - 160);
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(10, 80, 120, 15);
    ctx.fillStyle = "#374151";
    ctx.font = "bold 14px sans-serif";
    ctx.save();
    ctx.translate(70, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("SHOPPING CENTER", 0, 0);
    ctx.restore();

    // Sidewalk along building
    ctx.fillStyle = sidewalk;
    ctx.fillRect(130, 60, 10, H - 120);
    ctx.fillRect(lotLeft, lotTop, lotRight - lotLeft, 20);
    ctx.fillRect(lotLeft, lotBottom - 20, lotRight - lotLeft, 20);

    // Helper: draw 90-degree parking spot
    function drawSpot(x: number, y: number, facingDown: boolean, isHC = false) {
      const sy = facingDown ? y : y - spotH;
      
      if (isHC) {
        ctx.fillStyle = hcBlue;
        ctx.fillRect(x, sy, spotW, spotH);
        ctx.strokeStyle = "#93c5fd";
        ctx.lineWidth = 2;
        for (let i = 0; i < spotH; i += 8) {
          ctx.beginPath();
          ctx.moveTo(x, sy + i);
          ctx.lineTo(x + spotW, sy + i + 10);
          ctx.stroke();
        }
      }
      
      ctx.strokeStyle = white;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, sy);
      ctx.lineTo(x, sy + spotH);
      ctx.moveTo(x + spotW, sy);
      ctx.lineTo(x + spotW, sy + spotH);
      ctx.stroke();
    }

    // Helper: draw stop sign
    function drawStopSign(x: number, y: number) {
      ctx.fillStyle = stopRed;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI / 4) - Math.PI / 8;
        const px = x + 12 * Math.cos(a);
        const py = y + 12 * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = white;
      ctx.font = "bold 7px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("STOP", x, y);
    }

    // Helper: draw arrow
    function drawArrow(x: number, y: number, rotation: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = white;
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(8, 5);
      ctx.lineTo(3, 5);
      ctx.lineTo(3, 15);
      ctx.lineTo(-3, 15);
      ctx.lineTo(-3, 5);
      ctx.lineTo(-8, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Helper: draw island with tree
    function drawIsland(x: number, y: number, w: number, h: number) {
      ctx.fillStyle = islandGreen;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = treeGreen;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Row positions (y where spots start)
    const row1Top = lotTop + 25;
    const row2Top = row1Top + spotH + aisleH;
    const row3Top = row2Top + spotH + aisleH;
    const row4Top = row3Top + spotH + aisleH;

    // Calculate number of spots per row
    const startX = lotLeft + 50;
    const endX = lotRight - 50;
    const spotsPerRow = Math.floor((endX - startX) / spotW);

    // Row 1 - top row, facing down
    for (let i = 0; i < spotsPerRow; i++) {
      drawSpot(startX + i * spotW, row1Top, true);
    }

    // Row 2 - facing up (back to back with row 1)
    for (let i = 0; i < spotsPerRow; i++) {
      drawSpot(startX + i * spotW, row2Top + spotH, false);
    }

    // Row 3 - facing down, with HC spots
    const hcStart = Math.floor(spotsPerRow / 3);
    for (let i = 0; i < spotsPerRow; i++) {
      const isHC = i >= hcStart && i < hcStart + 4;
      drawSpot(startX + i * spotW, row3Top, true, isHC);
    }

    // Row 4 - facing up
    for (let i = 0; i < spotsPerRow; i++) {
      drawSpot(startX + i * spotW, row4Top + spotH, false);
    }

    // Landscaped islands at row ends
    drawIsland(lotLeft + 10, row1Top, 35, spotH * 2 + aisleH);
    drawIsland(lotRight - 45, row1Top, 35, spotH * 2 + aisleH);
    drawIsland(lotLeft + 10, row3Top, 35, spotH * 2 + aisleH);
    drawIsland(lotRight - 45, row3Top, 35, spotH * 2 + aisleH);

    // Corner islands
    drawIsland(lotRight - 80, lotTop, 50, 25);
    drawIsland(lotRight - 80, lotBottom - 25, 50, 25);

    // Stop signs at aisle intersections
    drawStopSign(lotLeft + 55, row1Top + spotH + aisleH / 2);
    drawStopSign(lotRight - 55, row1Top + spotH + aisleH / 2);
    drawStopSign(lotLeft + 55, row3Top + spotH + aisleH / 2);
    drawStopSign(lotRight - 55, row3Top + spotH + aisleH / 2);

    // Crosswalk near entrance
    ctx.fillStyle = crosswalkYellow;
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(lotLeft, row2Top + spotH + 20 + i * 10, 40, 6);
    }

    // Directional arrows in aisles
    const aisle1Y = row1Top + spotH + aisleH / 2;
    const aisle2Y = row3Top + spotH + aisleH / 2;
    drawArrow(lotLeft + 150, aisle1Y, Math.PI / 2);
    drawArrow(lotRight - 150, aisle1Y, -Math.PI / 2);
    drawArrow(lotLeft + 150, aisle2Y, Math.PI / 2);
    drawArrow(lotRight - 150, aisle2Y, -Math.PI / 2);

    // Entrance label
    ctx.fillStyle = "#16a34a";
    ctx.font = "bold 12px sans-serif";
    ctx.save();
    ctx.translate(lotLeft - 15, H / 2 + 50);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("ENTRANCE", 0, 0);
    ctx.restore();

    // Speed bump
    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(W / 2 - 40, row1Top + spotH + 5, 80, 8);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(W / 2 - 40 + i * 8, row1Top + spotH + 5);
      ctx.lineTo(W / 2 - 36 + i * 8, row1Top + spotH + 13);
      ctx.stroke();
    }

  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ display: "block", width: "100%", height: "auto" }}
      aria-label="Shopping center parking lot layout"
    />
  );
}
