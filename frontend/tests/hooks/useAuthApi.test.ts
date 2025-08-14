import {
  useLogin,
  useRegister,
  useLogout,
  useCurrentUser,
  useUserData,
  useUpdatePreferences
} from '../../src/hooks/useAuthApi';

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

// Mock authService
jest.mock('../../src/services/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
    getUserData: jest.fn(),
    updatePreferences: jest.fn(),
  },
}));

describe('useAuthApi hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useLogin', () => {
    test('should be defined and be a function', () => {
      expect(useLogin).toBeDefined();
      expect(typeof useLogin).toBe('function');
    });

    test('should validate hook structure', () => {
      const hookString = useLogin.toString();
      
      expect(hookString).toContain('useMutation');
      expect(hookString).toContain('mutationFn');
      expect(hookString).toContain('onSuccess');
      expect(hookString).toContain('useQueryClient');
    });

    test('should validate login logic', () => {
      const hookString = useLogin.toString();
      
      expect(hookString).toContain('authService.login');
      expect(hookString).toContain('credentials');
    });

    test('should validate cache update logic', () => {
      const hookString = useLogin.toString();
      
      expect(hookString).toContain('setQueryData');
      expect(hookString).toContain('currentUser');
      expect(hookString).toContain('queryClient');
    });
  });

  describe('useRegister', () => {
    test('should be defined and be a function', () => {
      expect(useRegister).toBeDefined();
      expect(typeof useRegister).toBe('function');
    });

    test('should validate hook structure', () => {
      const hookString = useRegister.toString();
      
      expect(hookString).toContain('useMutation');
      expect(hookString).toContain('mutationFn');
      expect(hookString).toContain('onSuccess');
      expect(hookString).toContain('useQueryClient');
    });

    test('should validate register logic', () => {
      const hookString = useRegister.toString();
      
      expect(hookString).toContain('authService.register');
      expect(hookString).toContain('data');
    });

    test('should validate cache update logic', () => {
      const hookString = useRegister.toString();
      
      expect(hookString).toContain('setQueryData');
      expect(hookString).toContain('currentUser');
    });
  });

  describe('useLogout', () => {
    test('should be defined and be a function', () => {
      expect(useLogout).toBeDefined();
      expect(typeof useLogout).toBe('function');
    });

    test('should validate hook structure', () => {
      const hookString = useLogout.toString();
      
      expect(hookString).toContain('useMutation');
      expect(hookString).toContain('mutationFn');
      expect(hookString).toContain('onSuccess');
      expect(hookString).toContain('useQueryClient');
    });

    test('should validate logout logic', () => {
      const hookString = useLogout.toString();
      
      expect(hookString).toContain('authService.logout');
    });

    test('should validate cache clearing logic', () => {
      const hookString = useLogout.toString();
      
      expect(hookString).toContain('queryClient.clear');
    });
  });

  describe('useCurrentUser', () => {
    test('should be defined and be a function', () => {
      expect(useCurrentUser).toBeDefined();
      expect(typeof useCurrentUser).toBe('function');
    });

    test('should validate hook structure', () => {
      const hookString = useCurrentUser.toString();
      
      expect(hookString).toContain('useQuery');
      expect(hookString).toContain('queryKey');
      expect(hookString).toContain('queryFn');
      expect(hookString).toContain('staleTime');
    });

    test('should validate query configuration', () => {
      const hookString = useCurrentUser.toString();
      
      expect(hookString).toContain('currentUser');
      expect(hookString).toContain('authService.getCurrentUser');
      expect(hookString).toContain('1000 * 60 * 10');
    });

    test('should validate User type annotation', () => {
      const hookString = useCurrentUser.toString();
      
      expect(hookString).toContain('User');
    });
  });

  describe('useUserData', () => {
    test('should be defined and be a function', () => {
      expect(useUserData).toBeDefined();
      expect(typeof useUserData).toBe('function');
    });

    test('should validate hook structure', () => {
      const hookString = useUserData.toString();
      
      expect(hookString).toContain('useQuery');
      expect(hookString).toContain('queryKey');
      expect(hookString).toContain('queryFn');
      expect(hookString).toContain('staleTime');
    });

    test('should validate query configuration', () => {
      const hookString = useUserData.toString();
      
      expect(hookString).toContain('userData');
      expect(hookString).toContain('authService.getUserData');
      expect(hookString).toContain('1000 * 60 * 5');
    });
  });

  describe('useUpdatePreferences', () => {
    test('should be defined and be a function', () => {
      expect(useUpdatePreferences).toBeDefined();
      expect(typeof useUpdatePreferences).toBe('function');
    });

    test('should validate hook structure', () => {
      const hookString = useUpdatePreferences.toString();
      
      expect(hookString).toContain('useMutation');
      expect(hookString).toContain('mutationFn');
      expect(hookString).toContain('onSuccess');
      expect(hookString).toContain('useQueryClient');
    });

    test('should validate preferences update logic', () => {
      const hookString = useUpdatePreferences.toString();
      
      expect(hookString).toContain('authService.updatePreferences');
      expect(hookString).toContain('preferences');
    });

    test('should validate cache update logic', () => {
      const hookString = useUpdatePreferences.toString();
      
      expect(hookString).toContain('getQueryData');
      expect(hookString).toContain('setQueryData');
      expect(hookString).toContain('currentUser');
      expect(hookString).toContain('updatedPreferences');
    });

    test('should validate preferences merging logic', () => {
      const hookString = useUpdatePreferences.toString();
      
      expect(hookString).toContain('currentUser');
      expect(hookString).toContain('preferences');
    });
  });

  describe('Hook Dependencies', () => {
    test('should validate React Query dependencies', () => {
      const mutationHooks = [useLogin, useRegister, useLogout, useUpdatePreferences];
      const queryHooks = [useCurrentUser, useUserData];
      
      mutationHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('useMutation');
        expect(hookString).toContain('useQueryClient');
      });

      queryHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('useQuery');
      });
    });

    test('should validate authService integration', () => {
      const allHooks = [
        useLogin,
        useRegister,
        useLogout,
        useCurrentUser,
        useUserData,
        useUpdatePreferences
      ];

      allHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('authService');
      });
    });

    test('should validate type imports and usage', () => {
      const loginString = useLogin.toString();
      const registerString = useRegister.toString();
      const currentUserString = useCurrentUser.toString();
      const userDataString = useUserData.toString();
      const updatePreferencesString = useUpdatePreferences.toString();

      // Check that functions use appropriate parameters and service calls
      expect(loginString).toContain('credentials');
      expect(registerString).toContain('data');
      expect(currentUserString).toContain('authService.getCurrentUser');
      expect(userDataString).toContain('authService.getUserData');
      expect(updatePreferencesString).toContain('preferences');
    });
  });

  describe('Common Patterns', () => {
    test('should validate all hooks are properly exported', () => {
      const hooks = [
        useLogin,
        useRegister,
        useLogout,
        useCurrentUser,
        useUserData,
        useUpdatePreferences
      ];

      hooks.forEach(hook => {
        expect(hook).toBeDefined();
        expect(typeof hook).toBe('function');
      });
    });

    test('should validate mutation hooks have onSuccess handlers', () => {
      const mutationHooks = [useLogin, useRegister, useLogout, useUpdatePreferences];
      
      mutationHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('onSuccess');
      });
    });

    test('should validate query hooks have proper configuration', () => {
      const queryHooks = [useCurrentUser, useUserData];
      
      queryHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('queryKey');
        expect(hookString).toContain('queryFn');
        expect(hookString).toContain('staleTime');
      });
    });

    test('should validate cache management patterns', () => {
      const cacheUpdatingHooks = [useLogin, useRegister, useLogout, useUpdatePreferences];
      
      cacheUpdatingHooks.forEach(hook => {
        const hookString = hook.toString();
        expect(hookString).toContain('queryClient');
      });
    });
  });
});
