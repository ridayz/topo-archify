import turtle
import math
import time

# Setup screen
screen = turtle.Screen()
screen.bgcolor("#0a0a0f")
screen.title("DNA Helix Animation")
screen.setup(width=800, height=700)
screen.tracer(0)  # Turn off automatic animation

# Create turtles for different parts
helix_turtle = turtle.Turtle()
helix_turtle.hideturtle()
helix_turtle.speed(0)
helix_turtle.pensize(2)

base_turtle = turtle.Turtle()
base_turtle.hideturtle()
base_turtle.speed(0)
base_turtle.pensize(3)

particle_turtle = turtle.Turtle()
particle_turtle.hideturtle()
particle_turtle.speed(0)
particle_turtle.pensize(1)

# Color palette - cyberpunk/dna theme
HELIX_COLORS = ["#00ff88", "#00ccff", "#ff0066", "#ffaa00", "#aa00ff", "#00ff88"]
BASE_PAIRS = [
    ("#00ff88", "#ff0066"),  # A-T (Green-Red)
    ("#00ccff", "#ffaa00"),  # C-G (Cyan-Gold)
    ("#ff0066", "#00ff88"),  # T-A
    ("#ffaa00", "#00ccff"),  # G-C
]

PARTICLE_COLORS = ["#00ff88", "#00ccff", "#ff0066", "#ffaa00", "#aa00ff", "#ffffff"]

class DNAHelix:
    def __init__(self):
        self.angle = 0
        self.helix_radius = 120
        self.helix_height = 300
        self.num_turns = 3
        self.base_pairs_per_turn = 10
        self.total_bases = self.num_turns * self.base_pairs_per_turn
        self.rotation_speed = 0.02
        self.particles = []
        self.init_particles()
        
    def init_particles(self):
        """Create floating particles around the helix"""
        for i in range(30):
            self.particles.append({
                'angle': i * (2 * math.pi / 30),
                'radius': 150 + (i % 3) * 30,
                'height': (i % 10) * 30 - 150,
                'speed': 0.01 + (i % 5) * 0.005,
                'size': 2 + (i % 4),
                'color': PARTICLE_COLORS[i % len(PARTICLE_COLORS)],
                'phase': i * 0.5
            })
    
    def draw_geometric_shape(self, t, x, y, size, shape_type, color, rotation):
        """Draw various geometric shapes at position"""
        t.penup()
        t.goto(x, y)
        t.setheading(rotation)
        t.pendown()
        t.color(color)
        t.fillcolor(color)
        t.begin_fill()
        
        if shape_type == "hexagon":
            for _ in range(6):
                t.forward(size)
                t.right(60)
        elif shape_type == "triangle":
            for _ in range(3):
                t.forward(size * 1.5)
                t.right(120)
        elif shape_type == "square":
            for _ in range(4):
                t.forward(size)
                t.right(90)
        elif shape_type == "pentagon":
            for _ in range(5):
                t.forward(size)
                t.right(72)
        elif shape_type == "octagon":
            for _ in range(8):
                t.forward(size * 0.7)
                t.right(45)
        elif shape_type == "diamond":
            for _ in range(4):
                t.forward(size)
                t.right(60 if _ % 2 == 0 else 120)
        elif shape_type == "star":
            for _ in range(5):
                t.forward(size)
                t.right(144)
        
        t.end_fill()
    
    def draw_base_pair(self, t, x1, y1, x2, y2, color1, color2, rotation, pulse):
        """Draw a base pair connection with geometric shapes at ends"""
        # Draw the connecting line (hydrogen bonds representation)
        t.penup()
        t.goto(x1, y1)
        t.pendown()
        t.color("#ffffff", 0.3)
        t.pensize(1 + pulse * 2)
        t.goto(x2, y2)
        
        # Draw geometric shapes at each end
        size = 8 + pulse * 4
        self.draw_geometric_shape(t, x1, y1, size, "hexagon", color1, rotation)
        self.draw_geometric_shape(t, x2, y2, size, "hexagon", color2, rotation + 180)
        
        # Add smaller inner shapes
        self.draw_geometric_shape(t, x1, y1, size * 0.5, "triangle", "#ffffff", rotation + 30)
        self.draw_geometric_shape(t, x2, y2, size * 0.5, "triangle", "#ffffff", rotation + 210)
    
    def draw_helix_strand(self, t, phase_offset, color):
        """Draw one helix strand as a series of geometric shapes"""
        strand_shapes = ["pentagon", "hexagon", "octagon", "diamond"]
        
        for i in range(self.total_bases * 2):
            # Calculate position on helix
            t_param = i / (self.total_bases * 2) * self.num_turns * 2 * math.pi
            radius = self.helix_radius * (0.9 + 0.1 * math.sin(t_param * 2 + self.angle))
            
            x = radius * math.cos(t_param + phase_offset + self.angle)
            y = (i / (self.total_bases * 2) - 0.5) * self.helix_height
            z_rotation = (t_param + phase_offset + self.angle) * 180 / math.pi
            
            # Project 3D to 2D with perspective
            perspective = 1 / (1 + (radius * math.sin(t_param + phase_offset + self.angle)) / 500)
            x_proj = x * perspective
            y_proj = y * perspective
            size_proj = max(3, 8 * perspective)
            
            # Alternate shapes along the strand
            shape_type = strand_shapes[i % len(strand_shapes)]
            
            # Pulsing effect
            pulse = 0.5 + 0.5 * math.sin(self.angle * 3 + i * 0.5)
            size_final = size_proj * (0.8 + 0.4 * pulse)
            
            # Color variation
            r = int(color[1:3], 16)
            g = int(color[3:5], 16)
            b = int(color[5:7], 16)
            brightness = 0.7 + 0.3 * pulse
            varied_color = f"#{int(r*brightness):02x}{int(g*brightness):02x}{int(b*brightness):02x}"
            
            self.draw_geometric_shape(t, x_proj, y_proj, size_final, shape_type, varied_color, z_rotation)
    
    def draw_base_pairs(self, t):
        """Draw base pairs connecting the two strands"""
        for i in range(self.total_bases):
            t_param = i / self.total_bases * self.num_turns * 2 * math.pi
            
            # Left strand position
            radius = self.helix_radius
            x1 = radius * math.cos(t_param + self.angle)
            y1 = (i / self.total_bases - 0.5) * self.helix_height
            
            # Right strand position (opposite side)
            x2 = radius * math.cos(t_param + math.pi + self.angle)
            y2 = y1
            
            # Perspective projection
            perspective1 = 1 / (1 + (radius * math.sin(t_param + self.angle)) / 500)
            perspective2 = 1 / (1 + (radius * math.sin(t_param + math.pi + self.angle)) / 500)
            
            x1_proj = x1 * perspective1
            y1_proj = y1 * perspective1
            x2_proj = x2 * perspective2
            y2_proj = y2 * perspective2
            
            # Select base pair colors (cycling through A-T, C-G pairs)
            base_idx = i % len(BASE_PAIRS)
            color1, color2 = BASE_PAIRS[base_idx]
            
            # Pulse effect for base pairs
            pulse = 0.5 + 0.5 * math.sin(self.angle * 4 + i * 0.8)
            rotation = (t_param + self.angle) * 180 / math.pi
            
            self.draw_base_pair(t, x1_proj, y1_proj, x2_proj, y2_proj, color1, color2, rotation, pulse)
    
    def update_particles(self):
        """Update and draw floating particles"""
        particle_turtle.clear()
        
        for p in self.particles:
            p['angle'] += p['speed']
            p['phase'] += 0.02
            
            # Orbital motion around helix
            x = p['radius'] * math.cos(p['angle'] + self.angle * 0.5)
            y = p['height'] + 20 * math.sin(p['phase'])
            
            # Perspective
            perspective = 1 / (1 + (p['radius'] * math.sin(p['angle'])) / 500)
            x_proj = x * perspective
            y_proj = y * perspective
            size_proj = max(1, p['size'] * perspective)
            
            # Pulsing alpha effect
            alpha_pulse = 0.3 + 0.7 * (0.5 + 0.5 * math.sin(p['phase'] * 2))
            
            particle_turtle.penup()
            particle_turtle.goto(x_proj, y_proj)
            particle_turtle.pendown()
            particle_turtle.color(p['color'])
            particle_turtle.dot(int(size_proj * 2))
            
            # Draw small geometric shape occasionally
            if int(p['phase'] * 10) % 20 < 5:
                self.draw_geometric_shape(particle_turtle, x_proj, y_proj, size_proj * 0.8, 
                                          "triangle", p['color'], p['phase'] * 50)
    
    def draw_glow_effects(self):
        """Draw subtle glow rings around the helix"""
        helix_turtle.pensize(1)
        for ring in range(3):
            radius = self.helix_radius * (1.1 + ring * 0.15)
            helix_turtle.penup()
            helix_turtle.goto(0, -150 - ring * 10)
            helix_turtle.setheading(0)
            helix_turtle.pendown()
            
            glow_colors = ["#00ff88", "#00ccff", "#ff0066"]
            color = glow_colors[ring]
            alpha = 0.1 + 0.15 * math.sin(self.angle * 2 + ring)
            helix_turtle.color(color)
            helix_turtle.circle(radius * (1 + 0.05 * math.sin(self.angle * 1.5 + ring)))
    
    def frame(self):
        """Draw one complete frame"""
        # Clear only the main drawing turtles (not particles - they clear themselves)
        helix_turtle.clear()
        base_turtle.clear()
        
        # Draw glow effects first (backmost)
        self.draw_glow_effects()
        
        # Draw the two helix strands
        self.draw_helix_strand(helix_turtle, 0, "#00ff88")      # Strand 1 - Green
        self.draw_helix_strand(helix_turtle, math.pi, "#00ccff") # Strand 2 - Cyan
        
        # Draw base pairs connecting strands
        self.draw_base_pairs(base_turtle)
        
        # Update and draw particles
        self.update_particles()
        
        # Update screen
        screen.update()
        
        # Increment angle for rotation
        self.angle += self.rotation_speed

# Create DNA helix instance
dna = DNAHelix()

# Animation loop
def animate():
    dna.frame()
    screen.ontimer(animate, 16)  # ~60 FPS

# Handle window close
def on_close():
    global running
    running = False
    screen.bye()

screen.getcanvas().winfo_toplevel().protocol("WM_DELETE_WINDOW", on_close)

# Start animation
running = True
animate()

# Keep window open
turtle.done()