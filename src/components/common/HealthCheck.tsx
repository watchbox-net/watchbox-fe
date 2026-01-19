'use client';

import { useEffect } from 'react';
import { healthCheck } from '@/lib/api/client';

export default function HealthCheck() {
    useEffect(() => {
        healthCheck()
            .then(() => console.log('Health check success'))
            .catch((error) => console.error('Health check failed:', error));
    }, []);

    return null;
}