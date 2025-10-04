import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Web Advanced API',
      version: '1.0.0',
      description: 'API documentation generated with JSDoc + swagger-jsdoc',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            username: {
              type: 'string'
            },
            is_active: {
              type: 'boolean'
            },
          },
        },
        UserInput: {
          type: 'object',
          properties: {
            email: { 
              type: 'string', 
              format: 'email' 
            },
            password: { 
              type: 'string' 
            },
            username: { 
              type: 'string' 
            },
          },
        },
        UserUpdate: {
          type: 'object',
          properties: {
            email: { 
              type: 'string', 
              format: 'email' 
            },
            password: { 
              type: 'string' 
            },
            username: { 
              type: 'string' 
            },
          },
        },
        Role: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer' 
            },
            name: { 
              type: 'string' 
            },
          },
        },
        RoleInput: {
          type: 'object',
          properties: {
            name: { 
              type: 'string'
            },
          },
        },
        UserRole: {
          type: 'object',
          properties: {
            user_id: { 
              type: 'integer' 
            },
            role_id: { 
              type: 'integer' 
            },
          },
        },
        Game: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer' 
            },
            name: { 
              type: 'string' 
            },
            abbreviation: { 
              type: 'string' 
            },
            is_active: { 
              type: 'boolean' 
            },
          },
        },
        GameInput: {
          type: 'object',
          properties: {
            name: { 
              type: 'string' 
            },
            abbreviation: { 
              type: 'string' 
            },
            is_active: { 
              type: 'boolean' 
            },
          },
        },
        ProPlayer: {
          type: 'object',
          properties: {
            user_id: { 
              type: 'integer' 
            },
            bio: { 
              type: 'string'
            },
            hourly_rate: { 
              type: 'number' 
            },
          },
        },
        ProPlayerInput: {
          type: 'object',
          properties: {
            bio: { 
              type: 'string' 
            },
            hourly_rate: { 
              type: 'number' 
            },
          },
        },
        ProPlayerGame: {
          type: 'object',
          properties: {
            pro_player_id: { 
              type: 'integer' 
            },
            game_id: { 
              type: 'integer' 
            },
            current_rank: { 
              type: 'string' 
            },
            years_experience: { 
              type: 'integer' 
            },
          },
        },
        Ad: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer' 
            },
            game_id: { 
              type: 'integer' 
            },
            pro_player_id: { 
              type: 'integer' 
            },
            name: { 
              type: 'string' 
            },
            description: { 
              type: 'string' 
            },
            max_reservations_per_user: { 
              type: 'integer' 
            },
            service_type: { 
              type: 'string' 
            },
            total_spots_available: { 
              type: 'integer' 
            },
            max_duration_minutes: { 
              type: 'integer' 
            },
          },
        },
        AdInput: {
          type: 'object',
          properties: {
            game_id: { 
              type: 'integer' 
            },
            pro_player_id: { 
              type: 'integer' 
            },
            name: { 
              type: 'string' 
            },
            description: { 
              type: 'string' 
            },
            max_reservations_per_user: { 
              type: 'integer' 
            },
            service_type: { 
              type: 'string'
            },
            total_spots_available: { 
              type: 'integer' 
            },
            max_duration_minutes: { 
              type: 'integer' 
            },
          },
        },
        AdUpdate: {
          type: 'object',
          properties: {
            game_id: { 
              type: 'integer' 
            },
            name: { 
              type: 'string' 
            },
            description: { 
              type: 'string' 
            },
            max_reservations_per_user: { 
              type: 'integer' 
            },
            service_type: { 
              type: 'string'
            },
            total_spots_available: { 
              type: 'integer' 
            },
            max_duration_minutes: { 
              type: 'integer' 
            },
          },
        },
        Reservation: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer' 
            },
            user_id: { 
              type: 'integer' 
            },
            ad_id: { 
              type: 'integer' 
            },
            status: { 
              type: 'string' 
            },
            customer_notes: { 
              type: 'string' 
            },
            start_date: { 
              type: 'string', 
              format: 'date-time' 
            },
            end_date: { 
              type: 'string', 
              format: 'date-time' 
            },
          },
        },
        ReservationInput: {
          type: 'object',
          properties: {
            user_id: { 
              type: 'integer' 
            },
            ad_id: { 
              type: 'integer' 
            },
            status: { 
              type: 'string' 
            },
            customer_notes: { 
              type: 'string' 
            },
            start_date: { 
              type: 'string', format: 'date-time' 
            },
            end_date: { 
              type: 'string', format: 'date-time' 
            },
          },
        },
        ReservationUpdate: {
          type: 'object',
          properties: {
            status: { 
              type: 'string' 
            },
            customer_notes: { 
              type: 'string' 
            },
            start_date: { 
              type: 'string', format: 'date-time' 
            },
            end_date: { 
              type: 'string', format: 'date-time' 
            },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: { 
              type: 'integer'
            },
            reservation_id: { 
              type: 'integer' 
            },
            user_id: { 
              type: 'integer' 
            },
            pro_player_id: { 
              type: 'integer' 
            },
            rating: { 
              type: 'integer', 
              minimum: 1, 
              maximum: 5 
            },
            comment: { 
              type: 'string' 
            },
          },
        },
        ReviewInput: {
          type: 'object',
          properties: {
            reservation_id: { 
              type: 'integer' 
            },
            user_id: { 
              type: 'integer' 
            },
            pro_player_id: { 
              type: 'integer' 
            },
            rating: { 
              type: 'integer', 
              minimum: 1, 
              maximum: 5 
            },
            comment: { 
              type: 'string' 
            },
          },
        },
        ReviewUpdate: {
          type: 'object',
          properties: {
            rating: { 
              type: 'integer', 
              minimum: 1, 
              maximum: 5 
            },
            comment: { 
              type: 'string' 
            },
          },
        },
        LoginInput: {
          type: 'object',
          properties: {
            email: { 
              type: 'string', 
              format: 'email' 
            },
            password: { 
              type: 'string' 
            },
          },
        },
        Login: {
          type: 'object',
          properties: {
            accessToken: { 
              type: 'string'
            },
          },
        },
      }
    },
    security: [
      { bearerAuth: [] }
    ],
  },
  // Point to folder where Swagger should look for the routes
  apis: ['./src/routes/*.js'], 
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);