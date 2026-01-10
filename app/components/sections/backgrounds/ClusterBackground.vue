<template>
  <div class="cluster-background">
    <svg ref="svg" width="100%" height="100%"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: "ClusterBackground",
  data() {
    return {
      mouseX: 0, // Позиция курсора по X
      mouseY: 0, // Позиция курсора по Y
      mouseRadius: 150, // Радиус влияния курсора на частицы
      isMouseMoving: false, // Флаг движения мыши
      mouseMoveTimeout: null // Таймер для определения остановки мыши
    }
  },
  mounted() {
    this.initClusterBackground();
    // Слушаем движение мыши
    window.addEventListener('mousemove', this.handleMouseMove);
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  },
  methods: {
    initClusterBackground() {
      const svg = d3.select(this.$refs.svg);
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Создаем данные для частиц
      const particles = d3.range(150).map(() => ({
        x: Math.random() * width, // Начальная позиция X
        y: Math.random() * height, // Начальная позиция Y
        vx: (Math.random() - 0.5) * 0.3, // Скорость по X (броуновское движение)
        vy: (Math.random() - 0.5) * 0.3, // Скорость по Y (броуновское движение)
        radius: Math.random() * 3 + 1, // Размер частицы
        group: Math.floor(Math.random() * 3), // Группа для цвета
        originalRadius: 0 // Исходный радиус (будет установлен позже)
      }));

      // Рисуем частицы
      const nodes = svg.selectAll('.particle')
        .data(particles)
        .enter().append('circle')
        .attr('class', 'particle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.radius)
        .attr('fill', d => this.getParticleColor(d.group))
        .attr('fill-opacity', 0.6) // Прозрачность заливки
        .attr('stroke', d => this.getParticleColor(d.group))
        .attr('stroke-opacity', 0.3); // Прозрачность обводки

      // Сохраняем исходные радиусы
      particles.forEach(d => d.originalRadius = d.radius);

      // Запускаем анимацию
      this.animateParticles(nodes, particles);
    },

    getParticleColor(group) {
      // Цвета частиц - можно настроить под ваш дизайн
      const colors = ["#a8f668", "#4ecdc4", "#01d9ff"];
      return colors[group] || "#a8f668";
    },

    handleMouseMove(event) {
      // Обновляем позицию курсора
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      this.isMouseMoving = true;

      // Сбрасываем таймер остановки мыши
      clearTimeout(this.mouseMoveTimeout);
      this.mouseMoveTimeout = setTimeout(() => {
        this.isMouseMoving = false;
      }, 100); // Считаем что мышь остановилась если не двигалась 100мс
    },

    animateParticles(nodes, particles) {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const forceFactor = 0.5; // Сила притяжения к курсору
      const repelFactor = 0.8; // Сила отталкивания при близком расстоянии
      const minDistance = 80; // Минимальное расстояние для отталкивания

      const animation = () => {
        particles.forEach(particle => {
          // Вычисляем расстояние до курсора
          const dx = this.mouseX - particle.x;
          const dy = this.mouseY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Броуновское движение (случайное смещение)
          particle.vx += (Math.random() - 0.5) * 0.1;
          particle.vy += (Math.random() - 0.5) * 0.1;

          // Ограничиваем максимальную скорость броуновского движения
          const maxBrownianSpeed = 0.5;
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          if (speed > maxBrownianSpeed) {
            particle.vx = (particle.vx / speed) * maxBrownianSpeed;
            particle.vy = (particle.vy / speed) * maxBrownianSpeed;
          }

          // Влияние курсора на частицы
          if (this.isMouseMoving && distance < this.mouseRadius) {
            // Сила притяжения/отталкивания в зависимости от расстояния
            const force = distance < minDistance ? -repelFactor : forceFactor;
            const angle = Math.atan2(dy, dx);
            
            particle.vx += Math.cos(angle) * force * (this.mouseRadius - distance) / this.mouseRadius;
            particle.vy += Math.sin(angle) * force * (this.mouseRadius - distance) / this.mouseRadius;
          }

          // Обновляем позицию
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Затухание скорости (сопротивление среды)
          particle.vx *= 0.98;
          particle.vy *= 0.98;

          // Отскок от границ
          if (particle.x < 0 || particle.x > width) {
            particle.vx *= -0.5;
            particle.x = particle.x < 0 ? 0 : width;
          }
          if (particle.y < 0 || particle.y > height) {
            particle.vy *= -0.5;
            particle.y = particle.y < 0 ? 0 : height;
          }

          // Эффект "пульсации" при приближении к курсору
          if (distance < this.mouseRadius && this.isMouseMoving) {
            particle.radius = particle.originalRadius * (1 + (this.mouseRadius - distance) / this.mouseRadius * 0.5);
          } else {
            // Плавное возвращение к исходному размеру
            particle.radius += (particle.originalRadius - particle.radius) * 0.1;
          }
        });

        // Обновляем позиции и размеры частиц
        nodes
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', d => d.radius);

        requestAnimationFrame(animation);
      };

      animation();
    }
  },
};
</script>

<style scoped>
.cluster-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none; /* Позволяет событиям мыши проходить сквозь элемент */
  opacity: 0.7; /* Общая прозрачность фона */
}

.particle {
  transition: r 0.3s ease; /* Плавное изменение размера */
}
</style>