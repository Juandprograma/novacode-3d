# NOVACODE 3D Experience

Experiencia 3D interactiva WebGL para Novacode - Agencia de desarrollo web en Bogotá.

## Características

- **Mundo 3D Inmersivo**: Escenario minimalista negro con grid dorado y niebla atmosférica
- **Vehículo Controlable**: Cubo estilizado dorado con físicas realistas
- **Controles**: WASD/Flechas para mover, ESPACIO para frenar
- **Zonas de Interacción**:
  - **Inicio**: Título "NOVACODE" gigante flotante
  - **Servicios**: 3 pilares dorados con información de servicios (Acortadores URL, Sistemas de Facturación, Simuladores de Subsidios)
  - **Contacto**: Arco dorado que abre WhatsApp al atravesarlo
- **UI Responsive**: Navbar fijo y controles móviles para dispositivos táctiles
- **Cámara Dinámica**: Seguimiento suave en tercera persona

## Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **3D**: Three.js + React Three Fiber + React Three Drei
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## Estructura del Proyecto

```
src/
  app/
    globals.css    # Estilos globales y tema Novacode
    layout.tsx     # Layout raíz
    page.tsx       # Página principal con Canvas 3D
  components/
    World.tsx      # Escenario 3D (grid, niebla, iluminación)
    Vehicle.tsx    # Vehículo dorado con físicas
    Stations.tsx   # Zonas de interacción
    UI.tsx         # Overlay 2D (navbar, controles móviles)
  hooks/
    useControls.ts      # Hook para controles teclado/táctil
    useVehiclePhysics.ts # Hook para físicas del vehículo
  types/
    index.ts       # Tipos TypeScript
```

## Controles

### Desktop
- **W / ↑**: Acelerar
- **S / ↓**: Retroceder
- **A / ←**: Girar izquierda
- **D / →**: Girar derecha
- **ESPACIO / B**: Frenar

### Móvil
- Botones táctiles en pantalla para dirección y freno

## Personalización

Los colores principales están definidos en `tailwind.config.ts`:
- Negro puro: `#000000`
- Dorado Novacode: `#D4AF37`

## Contacto

WhatsApp: https://wa.me/573006779183
