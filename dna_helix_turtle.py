"""
Magic DNA Helix - Python Turtle
Repeating geometric shapes (hexagons) with rotation animation
"""
import turtle
import math
import colorsys

# ── Setup ──────────────────────────────────────────────
screen = turtle.Screen()
screen.setup(900, 700)
screen.bgcolor("#0a0a1a")
screen.title("Magic DNA Helix")
screen.tracer(0, 0)

t = turtle.Turtle()
t.hideturtle()
t.speed(0)
t.penup()

# ── Color palette: neon DNA ───────────────────────────
def strand_color(t, idx, total):
    """Rainbow gradient along the helix."""
    hue = (idx / total + t * 0.3) % 1.0
    return colorsys.hsv_to_rgb(hue, 0.9, 1.0)

# ── Hexagon helper ─────────────────────────────────────
def draw_hexagon(x, y, size, color, alpha=1.0):
    t.color(color)
    t.pencolor(color)
    t.goto(x, y)
    t.pendown()
    for _ in range(6):
        t.fd(size)
        t.left(60)
    t.penup()

# ── Diamond helper ─────────────────────────────────────
def draw_diamond(x, y, size, color, alpha=1.0):
    t.color(color)
    t.pencolor(color)
    t.goto(x, y)
    t.pendown()
    for _ in range(4):
        t.fd(size)
        t.left(90)
    t.penup()

# ── Triangle helper ────────────────────────────────────
def draw_triangle(x, y, size, color):
    t.color(color)
    t.pencolor(color)
    t.goto(x, y)
    t.pendown()
    for _ in range(3):
        t.fd(size)
        t.left(120)
    t.penup()

# ── Dot connector ──────────────────────────────────────
def draw_dot(x, y, color, size=3):
    t.color(color)
    t.goto(x, y)
    t.dot(size)

# ── Draw the helix frame ───────────────────────────────
def draw_dna_helix(frame):
    t.clear()
    total_bonds = 40
    radius = 140
    pitch = 28
    cx, cy = 0, -240

    for i in range(total_bonds):
        t_frac = i / (total_bonds - 1)        # 0..1 along helix
        angle = t_frac * math.pi * 6 + frame  # full rotations

        # Position on helix
        x1 = cx + radius * math.cos(angle)
        y1 = cy + t_frac * 480
        x2 = cx + radius * math.cos(angle + math.pi)
        y2 = y1

        depth1 = math.sin(angle)                # -1 .. 1  (front/back)
        depth2 = math.sin(angle + math.pi)

        color1 = strand_color(t_frac, i, total_bonds)
        color2 = strand_color(t_frac, i + 5, total_bonds)

        # Depth-based scaling & opacity
        scale1 = 0.55 + 0.45 * (depth1 + 1) / 2
        scale2 = 0.55 + 0.45 * (depth2 + 1) / 2
        alpha1 = 0.35 + 0.65 * (depth1 + 1) / 2
        alpha2 = 0.35 + 0.65 * (depth2 + 1) / 2

        shape_size = 14 * scale1
        shape_size2 = 14 * scale2

        # Shape alternation
        shape_type = i % 3
        if shape_type == 0:
            draw_hexagon(x1, y1, shape_size, color1, alpha1)
            draw_hexagon(x2, y2, shape_size2, color2, alpha2)
        elif shape_type == 1:
            draw_diamond(x1, y1, shape_size, color1, alpha1)
            draw_diamond(x2, y2, shape_size2, color2, alpha2)
        else:
            draw_triangle(x1, y1, shape_size, color1)
            draw_triangle(x2, y2, shape_size2, color2)

        # Connecting base pairs (rungs)
        mx = (x1 + x2) / 2
        my = (y1 + y2) / 2
        rung_color = colorsys.hsv_to_rgb(
            (t_frac * 2 + 0.5) % 1.0, 0.7, 0.8
        )
        rung_alpha = 0.25 + 0.35 * ((depth1 + 1) / 2)
        t.color(rung_color)
        t.pencolor(rung_color)
        t.pensize(max(1, int(2 * ((depth1 + 1) / 2))))
        t.goto(x1, y1)
        t.pendown()
        t.goto(x2, y2)
        t.penup()
        t.pensize(1)

        # Glowing node at midpoint
        draw_dot(mx, my, rung_color, max(3, int(8 * ((depth1 + 1) / 2))))

    # ── Glow trails behind each strand ─────────────────
    trail_color = colorsys.hsv_to_rgb(
        (frame * 0.05) % 1.0, 0.85, 0.95
    )
    t.color(trail_color)
    t.pensize(2)
    for s in [-1, 1]:
        t.goto(cx + radius * math.cos(frame + s * math.pi), cy - 240)
        for j in range(1, 41):
            tf = j / 40
            ang = tf * math.pi * 6 + frame + s * math.pi
            nx = cx + radius * math.cos(ang)
            ny = cy + tf * 480
            t.goto(nx, ny)
    t.pensize(1)

    screen.update()

# ── Animation loop ─────────────────────────────────────
frame = 0.0
while True:
    draw_dna_helix(frame)
    frame += 0.028
    if frame > 2 * math.pi:
        frame -= 2 * math.pi
