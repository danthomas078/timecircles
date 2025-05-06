let constellations = [];
let selectedConstellation = null;
let scaleFactor = 1;
let offsetX = 0;
let offsetY = 0;
let backButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  createConstellations();

  // Create the return/back button (initially hidden)
  backButton = createButton('← Back');
  backButton.position(20, 20);
  backButton.mousePressed(() => {
    selectedConstellation = null;
    backButton.hide();
  });
  backButton.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (backButton) backButton.position(20, 20);
}

function draw() {
  background(0);

  translate(width / 2, height / 2);

  if (selectedConstellation) {
    drawConstellationCentered(selectedConstellation);
    drawInfo(selectedConstellation);
    backButton.show();
  } else {
    for (let c of constellations) {
      drawConstellation(c, false, 1, 0, 0);
      if (isHovered(c)) drawHoverLines(c);
    }
    backButton.hide();
  }
}

function mousePressed() {
  if (selectedConstellation) return;

  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;

  for (let c of constellations) {
    if (c.contains(mx, my)) {
      selectedConstellation = c;
      calculateFit(c);
      return;
    }
  }
}

function drawConstellation(c, showLines, scale = 1, offsetX = 0, offsetY = 0) {
  fill(255);
  noStroke();
  for (let s of c.stars) {
    let x = s.x * scale + offsetX;
    let y = s.y * scale + offsetY;
    ellipse(x, y, 5);
  }

  if (showLines) {
    stroke(0, 120, 255);
    strokeWeight(1.5);
    for (let [i, j] of c.connections) {
      let a = c.stars[i];
      let b = c.stars[j];
      line(
        a.x * scale + offsetX,
        a.y * scale + offsetY,
        b.x * scale + offsetX,
        b.y * scale + offsetY
      );
    }
  }
}

function drawConstellationCentered(c) {
  drawConstellation(c, true, scaleFactor, offsetX, offsetY);
}

function drawInfo(c) {
  resetMatrix(); // Reset transformations to draw in screen coordinates
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(20);
  text(c.name, 20, 70);
  textSize(14);
  text("Month: " + c.month, 20, 100);
  text(c.info, 20, 130, width / 3 - 40);
}

function raDecToXY(ra, dec) {
  let x = (ra - 12) * 40;
  let y = -dec * 10;
  return createVector(x, y);
}

class Constellation {
  constructor(name, stars, connections, info = "", month = "") {
    this.name = name;
    this.stars = stars.map(s => {
      let pos = raDecToXY(s.ra, s.dec);
      return { name: s.name, x: pos.x, y: pos.y };
    });
    this.connections = connections;
    this.info = info;
    this.month = month;
  }

  contains(x, y) {
    return this.stars.some(s => dist(x, y, s.x, s.y) < 10);
  }

  getBounds() {
    let xs = this.stars.map(s => s.x);
    let ys = this.stars.map(s => s.y);
    return {
      minX: min(xs),
      maxX: max(xs),
      minY: min(ys),
      maxY: max(ys)
    };
  }
}

function calculateFit(c) {
  let bounds = c.getBounds();
  let constellationWidth = bounds.maxX - bounds.minX;
  let constellationHeight = bounds.maxY - bounds.minY;
  let padding = 40;

  let scaleX = (width - padding * 2) / constellationWidth;
  let scaleY = (height - padding * 2) / constellationHeight;
  scaleFactor = min(scaleX, scaleY);

  let centerX = (bounds.minX + bounds.maxX) / 2;
  let centerY = (bounds.minY + bounds.maxY) / 2;

  offsetX = -centerX * scaleFactor;
  offsetY = -centerY * scaleFactor;
}

function createConstellations() {
  constellations.push(new Constellation("Aries", [
    { name: "Hamal", ra: 2.1196, dec: 23.4624 },
    { name: "Sheratan", ra: 1.9113, dec: 20.8080 },
    { name: "Mesarthim", ra: 1.9107, dec: 19.2933 }
  ], [[2,1],[1,0]], "Aries is symbolized by the ram and is associated with boldness and leadership.", "March"));

  constellations.push(new Constellation("Taurus", [
    { name: "Aldebaran", ra: 4.5987, dec: 16.5093 },
    { name: "Elnath", ra: 5.4382, dec: 28.6075 },
    { name: "Alcyone", ra: 3.7914, dec: 24.1051 },
    { name: "Atlas", ra: 3.6293, dec: 24.0534 },
    { name: "Electra", ra: 3.7036, dec: 24.1133 }
  ], [[2,3],[3,4],[2,0],[0,1]], "Taurus represents the bull and is linked with stability and strength.", "April"));

  constellations.push(new Constellation("Gemini", [
    { name: "Castor", ra: 7.5767, dec: 31.8883 },
    { name: "Pollux", ra: 7.7553, dec: 28.0262 },
    { name: "Wasat", ra: 7.3354, dec: 21.9823 },
    { name: "Mebsuta", ra: 6.3783, dec: 25.1311 },
    { name: "Tejat", ra: 6.8640, dec: 22.5052 }
  ], [[0,1],[1,2],[2,4],[4,3]], "Gemini symbolizes twins and is associated with communication and duality.", "May"));

  constellations.push(new Constellation("Cancer", [
    { name: "Acubens", ra: 8.9747, dec: 11.8575 },
    { name: "Altarf", ra: 8.1587, dec: 9.1856 },
    { name: "Asellus Borealis", ra: 8.1390, dec: 20.0000 },
    { name: "Asellus Australis", ra: 8.7448, dec: 18.1543 }
  ], [[1,2],[2,3],[3,0]], "Cancer, the crab, is a nurturing and emotional sign.", "June"));

  constellations.push(new Constellation("Leo", [
    { name: "Regulus", ra: 10.1395, dec: 11.9672 },
    { name: "Denebola", ra: 11.8177, dec: 14.5721 },
    { name: "Zosma", ra: 11.2373, dec: 20.5237 },
    { name: "Chort", ra: 11.2351, dec: 20.5233 },
    { name: "Algieba", ra: 10.3326, dec: 19.8415 }
  ], [[0,4],[4,3],[3,2],[2,1]], "Leo is the lion, representing courage, pride, and creativity.", "July"));

  constellations.push(new Constellation("Virgo", [
    { name: "Spica", ra: 13.4199, dec: -11.1613 },
    { name: "Vindemiatrix", ra: 13.0362, dec: 10.9591 },
    { name: "Porrima", ra: 12.6943, dec: 10.3702 },
    { name: "Zaniah", ra: 13.0648, dec: -0.5957 }
  ], [[0,3],[3,2],[2,1]], "Virgo is linked with logic, analysis, and service.", "August"));

  constellations.push(new Constellation("Libra", [
    { name: "Zubenelgenubi", ra: 14.8451, dec: -16.0418 },
    { name: "Zubeneschamali", ra: 15.2916, dec: -9.3826 },
    { name: "Brachium", ra: 15.0733, dec: -25.2819 }
  ], [[0,1],[0,2]], "Libra, the scales, stands for balance, harmony, and justice.", "September"));

  constellations.push(new Constellation("Scorpius", [
    { name: "Antares", ra: 16.4901, dec: -26.4319 },
    { name: "Shaula", ra: 17.5601, dec: -37.1038 },
    { name: "Sargas", ra: 17.6219, dec: -42.9978 },
    { name: "Dschubba", ra: 16.0055, dec: -22.6217 }
  ], [[0,3],[3,1],[1,2]], "Scorpius is the scorpion, intense and passionate.", "October"));

  constellations.push(new Constellation("Sagittarius", [
    { name: "Kaus Australis", ra: 18.4029, dec: -34.3846 },
    { name: "Nunki", ra: 18.9211, dec: -26.2967 },
    { name: "Ascella", ra: 18.6156, dec: -29.8282 },
    { name: "Kaus Media", ra: 18.0790, dec: -29.5778 }
  ], [[0,2],[2,1],[1,3]], "Sagittarius is the archer, a sign of adventure and exploration.", "November"));

  constellations.push(new Constellation("Capricornus", [
    { name: "Deneb Algedi", ra: 21.7367, dec: -16.1273 },
    { name: "Dabih", ra: 20.2946, dec: -14.7814 },
    { name: "Nashira", ra: 21.2749, dec: -16.6622 }
  ], [[1,2],[2,0]], "Capricornus, the sea-goat, symbolizes discipline and ambition.", "December"));

  constellations.push(new Constellation("Aquarius", [
    { name: "Sadalmelik", ra: 22.0967, dec: -0.3197 },
    { name: "Sadalsuud", ra: 21.7367, dec: -5.5717 },
    { name: "Skat", ra: 22.8779, dec: -15.8208 }
  ], [[0,1],[1,2]], "Aquarius, the water-bearer, represents innovation and individuality.", "January"));

  constellations.push(new Constellation("Pisces", [
    { name: "Alrescha", ra: 2.0333, dec: 2.7639 },
    { name: "Fum al Samakah", ra: 1.4312, dec: 15.1835 },
    { name: "Kullat Nunu", ra: 0.9137, dec: 3.3964 }
  ], [[0,1],[1,2]], "Pisces is the sign of empathy, imagination, and intuition.", "February"));
}

function isHovered(constellation) {
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  
  for (let s of constellation.stars) {
    if (dist(mx, my, s.x, s.y) < 10) {
      return true;
    }
  }
  return false;
}

function drawHoverLines(c) {
  stroke(255, 255, 255, 50);
  strokeWeight(2);
  for (let [i, j] of c.connections) {
    let a = c.stars[i];
    let b = c.stars[j];
    line(a.x, a.y, b.x, b.y);
  }
}
