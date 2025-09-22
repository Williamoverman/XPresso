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
            required: ['id', 'email', 'username', 'is_active'],
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
            is_active: {
              type: 'boolean'
            },
          },
          required: ['email', 'password', 'username'],
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
          required: ['id', 'name'],
        },
        RoleInput: {
          type: 'object',
          properties: {
            name: { 
              type: 'string'
            },
          },
          required: ['name'],
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
          required: ['user_id', 'role_id'],
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
          required: ['id', 'name', 'is_active'],
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
          required: ['name'],
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
          required: ['user_id', 'hourly_rate'],
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
          required: ['user_id', 'hourly_rate'],
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
          required: ['pro_player_id', 'game_id'],
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
          required: ['id', 'identifier', 'name', 'max_reservations_per_user', 'service_type', 'total_spots_available'],
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
          required: ['identifier', 'name', 'max_reservations_per_user', 'service_type', 'total_spots_available'],
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
          required: ['identifier', 'name', 'max_reservations_per_user', 'service_type', 'total_spots_available'],
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
          required: ['id', 'status', 'start_date', 'end_date'],
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
          required: ['status', 'start_date', 'end_date'],
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
          required: ['status', 'start_date', 'end_date'],
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
          required: ['id', 'rating'],
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
          required: ['rating'],
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
          required: ['rating'],
        },
      }
    }
  },
  // Point to folder where Swagger should look for the routes
  apis: ['./src/routes/*/*.js'], 
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);