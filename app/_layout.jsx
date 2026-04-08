import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useProtectedRoute() {
  const [isNavigationReady, setNavigationReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = router?.addListener('state', (event) => {
      console.log("INFO: Router is ready:", event);
      setNavigationReady(true);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);

  useEffect(() => {
    if (!isNavigationReady) {
      return;
    }

    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        console.log("Token found:", token);

        if (token) {
          router.replace('/home'); 
        } else {
          router.replace('/index');
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkAuthStatus();
  }, [isNavigationReady, router]);
}


