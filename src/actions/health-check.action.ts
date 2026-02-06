'use server';

import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function healthCheckAction() {
    try {
        const startTime = Date.now();

        // Spring Boot 백엔드로 헬스체크 요청
        const response = await axios.get(`${SERVER_URL}/health`, {
            timeout: 5000,
        });

        const responseTime = Date.now() - startTime;

        return {
            success: true,
            message: 'Next.js ↔ Spring Boot 연결 성공',
            backendMessage: response.data,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
            backendUrl: SERVER_URL,
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'Next.js ↔ Spring Boot 연결 실패',
            error: error.message,
            backendUrl: SERVER_URL,
            timestamp: new Date().toISOString(),
        };
    }
}

export async function healthInfoAction() {
    try {
        const startTime = Date.now();

        const response = await axios.get(`${SERVER_URL}/health/info`, {
            timeout: 5000,
        });

        const responseTime = Date.now() - startTime;

        return {
            success: true,
            message: 'Server Info 조회 성공',
            serverInfo: response.data,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'Server Info 조회 실패',
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
}

export async function healthTimeAction() {
    try {
        const startTime = Date.now();

        const response = await axios.get(`${SERVER_URL}/health/time`, {
            timeout: 5000,
        });

        const responseTime = Date.now() - startTime;

        return {
            success: true,
            message: 'Server Time 조회 성공',
            serverTime: response.data,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            success: false,
            message: 'Server Time 조회 실패',
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
}

