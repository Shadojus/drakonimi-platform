export async function GET() {
  return Response.json({
    status: 'healthy',
    service: 'Drakonomi',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    convex: process.env.NEXT_PUBLIC_CONVEX_URL ? 'configured' : 'missing'
  });
}
