import { MetadataRoute } from 'next'

// Generated at build time (required for static export)
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ParkCore: Parking Allocation Simulator',
    short_name: 'ParkCore',
    description: 'A real-time parking lot simulation with smart stall allocation and collision avoidance.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffdf0',
    theme_color: '#383b40',
    icons: [
      {
        src: '/icon.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
  }
}
