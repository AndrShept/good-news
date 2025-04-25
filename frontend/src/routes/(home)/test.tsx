import { Button } from '@/components/ui/button';
import { createFileRoute } from '@tanstack/react-router';
import { Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/(home)/test')({
  component: RouteComponent,
});


function RouteComponent() {

  return <div className="space-y-0.5"></div>;
}
