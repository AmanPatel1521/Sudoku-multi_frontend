class SudokuVariantsEngine {
    constructor(boardContainerSelector) {
        this.boardContainer = document.querySelector(boardContainerSelector);
        if (!this.boardContainer) {
            console.error("VariantsEngine: Board container not found!");
            return;
        }
        
        // Remove existing overlay if any
        let existingOverlay = this.boardContainer.querySelector('.variant-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create the SVG overlay
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.classList.add('variant-overlay');
        this.svg.setAttribute("viewBox", "0 0 900 900");
        this.svg.style.position = "absolute";
        this.svg.style.top = "0";
        this.svg.style.left = "0";
        this.svg.style.width = "100%";
        this.svg.style.height = "100%";
        this.svg.style.pointerEvents = "none"; // Let clicks pass through to the cells
        this.svg.style.zIndex = "5"; // Above cells, below floating cursors
        
        // We need the board container to be relative so absolute positioning works
        if (getComputedStyle(this.boardContainer).position === 'static') {
            this.boardContainer.style.position = 'relative';
        }
        
        this.boardContainer.appendChild(this.svg);
    }

    clear() {
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
    }

    render(variantData) {
        this.clear();
        if (!variantData) return;

        if (variantData.thermos) {
            this.drawThermos(variantData.thermos);
        }
        if (variantData.arrows) {
            this.drawArrows(variantData.arrows);
        }
        if (variantData.cages) {
            this.drawKillerCages(variantData.cages);
        }
    }

    // Helper: Get center coordinates of a cell in the 900x900 viewBox
    getCellCenter(r, c) {
        return {
            x: (c * 100) + 50,
            y: (r * 100) + 50
        };
    }

    drawThermos(thermos) {
        thermos.forEach(thermoPath => {
            if (thermoPath.length === 0) return;

            // Group to hold thermo elements
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("fill", "rgba(180, 180, 180, 0.4)");
            group.setAttribute("stroke", "rgba(180, 180, 180, 0.4)");
            
            // Draw Bulb at start
            const startCell = thermoPath[0];
            const startCenter = this.getCellCenter(startCell[0], startCell[1]);
            const bulb = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            bulb.setAttribute("cx", startCenter.x);
            bulb.setAttribute("cy", startCenter.y);
            bulb.setAttribute("r", "35"); // Large bulb
            group.appendChild(bulb);

            // Draw Path
            if (thermoPath.length > 1) {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                let d = `M ${startCenter.x} ${startCenter.y} `;
                for (let i = 1; i < thermoPath.length; i++) {
                    const pt = this.getCellCenter(thermoPath[i][0], thermoPath[i][1]);
                    d += `L ${pt.x} ${pt.y} `;
                }
                path.setAttribute("d", d);
                path.setAttribute("stroke-width", "30"); // Thick line
                path.setAttribute("stroke-linecap", "round");
                path.setAttribute("stroke-linejoin", "round");
                path.setAttribute("fill", "none");
                group.appendChild(path);
            }

            this.svg.appendChild(group);
        });
    }

    drawArrows(arrows) {
        arrows.forEach(arrow => {
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            group.setAttribute("stroke", "rgba(200, 200, 200, 0.6)");
            
            // Draw Bulb
            const sumCell = arrow.sum_cell;
            const bulbCenter = this.getCellCenter(sumCell[0], sumCell[1]);
            const bulb = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            bulb.setAttribute("cx", bulbCenter.x);
            bulb.setAttribute("cy", bulbCenter.y);
            bulb.setAttribute("r", "38");
            bulb.setAttribute("fill", "none");
            bulb.setAttribute("stroke-width", "4");
            group.appendChild(bulb);

            // Draw Path
            const pathCells = arrow.path;
            if (pathCells && pathCells.length > 0) {
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                let d = `M ${bulbCenter.x} ${bulbCenter.y} `;
                let lastPt = bulbCenter;
                for (let i = 0; i < pathCells.length; i++) {
                    const pt = this.getCellCenter(pathCells[i][0], pathCells[i][1]);
                    d += `L ${pt.x} ${pt.y} `;
                    lastPt = pt;
                }
                path.setAttribute("d", d);
                path.setAttribute("stroke-width", "4");
                path.setAttribute("stroke-linecap", "round");
                path.setAttribute("stroke-linejoin", "round");
                path.setAttribute("fill", "none");
                group.appendChild(path);
                
                // Draw Arrow Head at the end
                // We need to calculate the angle of the last segment
                if (pathCells.length >= 1) {
                    let prevPt = pathCells.length === 1 ? bulbCenter : this.getCellCenter(pathCells[pathCells.length-2][0], pathCells[pathCells.length-2][1]);
                    let dx = lastPt.x - prevPt.x;
                    let dy = lastPt.y - prevPt.y;
                    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
                    
                    const head = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                    head.setAttribute("points", "0,-10 20,0 0,10");
                    head.setAttribute("fill", "rgba(200, 200, 200, 0.6)");
                    head.setAttribute("transform", `translate(${lastPt.x}, ${lastPt.y}) rotate(${angle})`);
                    group.appendChild(head);
                }
            }

            this.svg.appendChild(group);
        });
    }

    drawKillerCages(cages) {
        cages.forEach(cage => {
            const cells = cage.cells;
            if (!cells || cells.length === 0) return;
            
            const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
            
            // To draw the cage outline, we check all 4 edges of every cell.
            // If the adjacent cell is NOT in the cage, we draw that edge.
            const cellSet = new Set(cells.map(c => `${c[0]},${c[1]}`));
            
            const margin = 8; // Offset inwards so it doesn't overlap the main grid lines
            
            cells.forEach(cell => {
                const r = cell[0];
                const c = cell[1];
                const x = c * 100;
                const y = r * 100;
                
                // Edges: Top, Right, Bottom, Left
                const hasTop = cellSet.has(`${r-1},${c}`);
                const hasRight = cellSet.has(`${r},${c+1}`);
                const hasBottom = cellSet.has(`${r+1},${c}`);
                const hasLeft = cellSet.has(`${r},${c-1}`);
                
                let d = "";
                // Top Edge
                if (!hasTop) {
                    let startX = x + margin;
                    let endX = x + 100 - margin;
                    if (hasLeft) startX = x - margin;
                    if (hasRight) endX = x + 100 + margin;
                    d += `M ${startX} ${y + margin} L ${endX} ${y + margin} `;
                }
                // Right Edge
                if (!hasRight) {
                    let startY = y + margin;
                    let endY = y + 100 - margin;
                    if (hasTop) startY = y - margin;
                    if (hasBottom) endY = y + 100 + margin;
                    d += `M ${x + 100 - margin} ${startY} L ${x + 100 - margin} ${endY} `;
                }
                // Bottom Edge
                if (!hasBottom) {
                    let startX = x + margin;
                    let endX = x + 100 - margin;
                    if (hasLeft) startX = x - margin;
                    if (hasRight) endX = x + 100 + margin;
                    d += `M ${startX} ${y + 100 - margin} L ${endX} ${y + 100 - margin} `;
                }
                // Left Edge
                if (!hasLeft) {
                    let startY = y + margin;
                    let endY = y + 100 - margin;
                    if (hasTop) startY = y - margin;
                    if (hasBottom) endY = y + 100 + margin;
                    d += `M ${x + margin} ${startY} L ${x + margin} ${endY} `;
                }
                
                if (d) {
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", d);
                    path.setAttribute("stroke", "rgba(255, 255, 255, 0.7)");
                    path.setAttribute("stroke-width", "2");
                    path.setAttribute("stroke-dasharray", "6, 4");
                    path.setAttribute("fill", "none");
                    group.appendChild(path);
                }
            });
            
            // Add Sum Text
            // Find top-leftmost cell for the sum text
            let topLeftCell = cells[0];
            cells.forEach(c => {
                if (c[0] < topLeftCell[0] || (c[0] === topLeftCell[0] && c[1] < topLeftCell[1])) {
                    topLeftCell = c;
                }
            });
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", (topLeftCell[1] * 100) + 12);
            text.setAttribute("y", (topLeftCell[0] * 100) + 25);
            text.setAttribute("fill", "rgba(255, 255, 255, 0.9)");
            text.setAttribute("font-size", "22");
            text.setAttribute("font-family", "Outfit, sans-serif");
            text.setAttribute("font-weight", "600");
            text.textContent = cage.sum;
            group.appendChild(text);
            
            this.svg.appendChild(group);
        });
    }
}

// Make it available globally
window.SudokuVariantsEngine = SudokuVariantsEngine;
