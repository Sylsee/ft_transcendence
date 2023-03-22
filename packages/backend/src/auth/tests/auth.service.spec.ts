import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          // Mock JWT guard to allow the test request to pass through
          return true;
        },
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token and user object', async () => {
      const mockUser = {
        profile: {
          id: 1,
          login: 'testuser',
          image: { link: 'https://example.com/avatar.jpg' },
        },
      };
      const expectedResult = {
        token: 'mock_token',
        user: {
          id: mockUser.profile.id,
          login: mockUser.profile.login,
          avatar: mockUser.profile.image.link,
        },
      };

      jest.spyOn(authService, 'login').mockImplementation(() => expectedResult);

      const result = await authController.login({ user: mockUser });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should return the user object', () => {
      const req = { user: { username: 'testuser', sub: 1 } };
      const result = authController.getProfile(req);
      expect(result).toEqual(req.user);
    });
  });
});
