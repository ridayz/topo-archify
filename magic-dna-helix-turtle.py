"""Magic DNA Helix - Python Turtle: repeating geometric shapes + animated rotation."""
import turtle
import math
import colorsys

screen = turtle.Screen()
screen.setup(900, 700)
screen.bgcolor("#070714")
screen.title("Magic DNA Helix")
screen.tracer(0, 0)

t = turtle.Turtle()
t.hideturtle()
t.speed(0)
t.penup()

SHAPES = ["hexagon", "diamond", "triangle", "star"]

def poly(x, y, sides, size, color, rot=0):
    t.color(color)
    t.goto(x, y)
    t.setheading(rot)
    t.pendown()
    for _ in range(sides):
        t.forward(size)
        t.left(360 / sides)
    t.penup()

def draw_shape(kind, x, y, size, color, rot):
    if kind == "hexagon":
        poly(x, y, 6, size, color, rot)
    elif kind == "diamond":
        poly(x, y, 4, size, color, rot)
    elif kind == "triangle":
        poly(x, y, 3, size, color, rot)
    else:  # star sparkle
        t.color(color)
        t.goto(x, y)
        t.dot(max(2, int(size * 0.5)))

def dna(frame):
    t.clear()
    N, R = 36, 150
    for i in range(N):
        f = i / (N - 1)
        a = f * math.pi * 6 + frame
        y = -240 + f * 480
        x1 = R * math.cos(a)
        x2 = R * math.cos(a + math.pi)
        d1 = (math.sin(a) + 1) / 2
        d2 = (math.sin(a + math.pi) + 1) / 2
        c1 = colorsys.hsv_to_rgb((f + frame * 0.05) % 1, 0.9, 1)
        c2 = colorsys.hsv_to_rgb((f + 0.5 + frame * 0.05) % 1, 0.9, 1)
        kind = SHAPES[i % len(SHAPES)]
        s1, s2 = 8 + 12 * d1, 8 + 12 * d2
        # rung
        t.color((0.4, 0.5, 1))
        t.pensize(1 if d1 < 0.5 else 2)
        t.goto(x1, y); t.pendown(); t.goto(x2, y); t.penup()
        t.goto((x1 + x2) / 2, y); t.color(c1); t.dot(max(2, int(7 * d1)))
        draw_shape(kind, x1, y, s1, c1, rot=frame * 57 + i * 20)
        draw_shape(kind, x2, y, s2, c2, rot=-frame * 57 + i * 20)
    screen.update()

frame = 0.0
while True:
    dna(frame)
    frame += 0.03
    if frame > 2 * math.pi:
        frame -= 2 * math.pi
