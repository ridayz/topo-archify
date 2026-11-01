"""
Magic DNA Helix - Python Turtle
Repeating geometric shapes (hexagon / diamond / triangle / star) arranged on a
double helix, with animated rotation driven by a small hand-rolled 3D projection.

Controls
    Up / Down   change rotation speed
    R           reverse direction
    S           toggle geometric shapes <-> light sparkles
    Q / Esc     quit
"""

import math
import turtle

# --------------------------------------------------------------------------
# Scene
# --------------------------------------------------------------------------
WIDTH, HEIGHT = 1000, 760
BG = "#070714"

screen = turtle.Screen()
screen.setup(WIDTH, HEIGHT)
screen.bgcolor(BG)
screen.title("Magic DNA Helix")
screen.tracer(0, 0)
screen.colormode(255)

t = turtle.Turtle()
t.hideturtle()
t.speed(0)
t.penup()

# --------------------------------------------------------------------------
# Palette (flat, no gradients): cyan -> violet -> pink
# --------------------------------------------------------------------------
STOPS = [
    (34, 211, 238),   # cyan
    (167, 139, 250),  # violet
    (244, 114, 182),  # pink
    (250, 204, 21),   # amber
]


def sample_palette(t0):
    """Interpolate the palette at t0 in [0, 1) and return (r, g, b)."""
    t0 %= 1.0
    span = 1.0 / (len(STOPS) - 1)
    idx = min(int(t0 / span), len(STOPS) - 2)
    local = (t0 - idx * span) / span
    a, b = STOPS[idx], STOPS[idx + 1]
    return tuple(int(a[i] + (b[i] - a[i]) * local) for i in range(3))


def shade(color, factor):
    """Scale a color toward black by factor in [0, 1]."""
    return tuple(max(0, min(255, int(c * factor))) for c in color)


def mix(a, b, amount):
    return tuple(int(a[i] + (b[i] - a[i]) * amount) for i in range(3))


# --------------------------------------------------------------------------
# Repeating geometric primitives
# --------------------------------------------------------------------------
def trace_polygon(vertices, color, width=1):
    """Draw a closed polygon from a list of (x, y) vertices."""
    t.color(color)
    t.pensize(width)
    t.goto(vertices[0])
    t.pendown()
    for vx, vy in vertices[1:]:
        t.goto(vx, vy)
    t.goto(vertices[0])
    t.penup()


def regular_polygon(cx, cy, radius, sides, rotation):
    pts = []
    for k in range(sides):
        a = rotation + (2 * math.pi * k / sides)
        pts.append((cx + radius * math.cos(a), cy + radius * math.sin(a)))
    return pts


def star_polygon(cx, cy, outer, inner, points, rotation):
    pts = []
    for k in range(points * 2):
        radius = outer if k % 2 == 0 else inner
        a = rotation + (math.pi * k / points)
        pts.append((cx + radius * math.cos(a), cy + radius * math.sin(a)))
    return pts


def draw_node(kind, cx, cy, radius, color, rotation):
    """A 'node' is one repeating geometric shape on the strand."""
    if radius < 1.2:
        return

    if kind == "hexagon":
        trace_polygon(regular_polygon(cx, cy, radius, 6, rotation), color)
    elif kind == "diamond":
        trace_polygon(regular_polygon(cx, cy, radius, 4, rotation + math.pi / 4), color)
    elif kind == "triangle":
        trace_polygon(regular_polygon(cx, cy, radius, 3, rotation), color)
    elif kind == "square":
        trace_polygon(regular_polygon(cx, cy, radius, 4, rotation), color)
    elif kind == "star":
        trace_polygon(star_polygon(cx, cy, radius, radius * 0.45, 5, rotation), color)
    else:  # "sparkle"
        t.color(color)
        t.goto(cx, cy)
        t.dot(max(2, int(radius * 0.9)))


SHAPES = ["hexagon", "diamond", "triangle", "star"]
SPARKLE = ["sparkle"]


# --------------------------------------------------------------------------
# Helix model
# --------------------------------------------------------------------------
TURNS = 3.5          # how many full rotations along the strand
NODES = 44           # base pairs
RADIUS = 165         # helix radius (pixels)
TOP, BOTTOM = 300, -300
BASE_PAIR_EVERY = 2  # draw a rung every N nodes

DEPTH = 420.0        # camera distance for the 3D projection


def project(cx3d, cy3d, z):
    """
    Perspective projection around the local node center.
    z is the depth offset; larger z = closer to the camera.
    """
    scale = DEPTH / (DEPTH - z)
    return cx3d * scale, cy3d * scale, scale


def draw_helix(phase, spin, shapes_on=True):
    t.clear()
    kinds = SHAPES if shapes_on else SPARKLE

    nodes = []
    for i in range(NODES):
        f = i / (NODES - 1)
        angle = f * math.pi * 2 * TURNS + phase
        y = BOTTOM + f * (TOP - BOTTOM)

        # Two strands, offset by PI
        for strand, offset in ((0, 0.0), (1, math.pi)):
            a = angle + offset
            x3d = RADIUS * math.sin(a)
            z = RADIUS * math.cos(a)          # depth
            sx, sy, scale = project(x3d, 0.0, z)
            nodes.append({
                "i": i, "strand": strand, "f": f,
                "x": sx, "y": y + sy,
                "z": z, "scale": scale,
            })

        # Base pair rung metadata, stored on strand 0
        if i % BASE_PAIR_EVERY == 0:
            nodes[-2]["rung"] = nodes[-1]

    # Painter's algorithm: far nodes first so near shapes overlap correctly
    nodes.sort(key=lambda n: n["z"])

    for n in nodes:
        depth = (n["z"] + RADIUS) / (2 * RADIUS)   # 0 = far, 1 = near
        near = 0.35 + 0.75 * depth                 # brightness + size by depth

        base = sample_palette(n["f"] * 0.85 + (0.5 if n["strand"] else 0.0)
                              + spin * 0.08)
        color = shade(base, near)

        # Base pair rung connecting the two strands, drawn once per pair.
        rung = n.get("rung")
        if rung is not None:
            rc = shade(sample_palette(n["f"] * 0.85 + spin * 0.08), 0.45 + 0.4 * depth)
            t.color(rc)
            t.pensize(1 if depth < 0.5 else 2)
            t.goto(n["x"], n["y"])
            t.pendown()
            t.goto(rung["x"], rung["y"])
            t.penup()

        kind = kinds[n["i"] % len(kinds)]
        radius = (7 + 11 * depth) * n["scale"]
        rotation = spin * 1.1 + n["i"] * 0.42 + (math.pi if n["strand"] else 0.0)

        # Glow halo behind the brightest near-side nodes
        if n["z"] > RADIUS * 0.45 and shapes_on:
            t.color(shade(base, 0.22 * near))
            t.goto(n["x"], n["y"])
            t.dot(int(radius * 2.6))

        draw_node(kind, n["x"], n["y"], radius, color, rotation)

    screen.update()


# --------------------------------------------------------------------------
# Main loop (turtle's own event loop via ontimer keeps input responsive)
# --------------------------------------------------------------------------
state = {"phase": 0.0, "spin": 0.0, "speed": 0.045, "shapes": True}


def tick():
    state["phase"] += state["speed"]
    state["spin"] += state["speed"] * 2.2
    draw_helix(state["phase"], state["spin"], state["shapes"])
    screen.ontimer(tick, 16)


def faster():
    state["speed"] = min(0.20, state["speed"] + 0.015)


def slower():
    state["speed"] = max(0.005, state["speed"] - 0.015)


def reverse():
    state["speed"] = -state["speed"]


def toggle_shapes():
    state["shapes"] = not state["shapes"]


def quit_():
    screen.bye()


screen.listen()
screen.onkey(faster, "Up")
screen.onkey(slower, "Down")
screen.onkey(reverse, "r")
screen.onkey(toggle_shapes, "s")
screen.onkey(quit_, "q")
screen.onkey(quit_, "Escape")
screen.onclick(lambda x, y: toggle_shapes())

tick()
screen.mainloop()
