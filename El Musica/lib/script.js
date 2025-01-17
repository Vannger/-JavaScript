document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fireCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fireParticles = [];
    const colors = ['red', 'orange', 'yellow'];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Flame {
        constructor(x, y, size, speed) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speed = speed;
            this.color = colors[Math.floor(random(0, colors.length))];
        }

        update() {
            this.y -= this.speed;
            this.size *= 0.95; // Shrink over time
            if (this.size < 0.5) {
                this.size = 0;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function createFireEffect() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (fireParticles.length < 100) {
            const x = random(canvas.width / 4, canvas.width * 3 / 4);
            const y = canvas.height;
            const size = random(10, 20);
            const speed = random(1, 3);
            fireParticles.push(new Flame(x, y, size, speed));
        }

        fireParticles.forEach((particle, index) => {
            particle.update();
            particle.draw();

            if (particle.size === 0) {
                fireParticles.splice(index, 1);
            }
        });

        requestAnimationFrame(createFireEffect);
    }

    createFireEffect();
});
