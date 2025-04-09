const swaggerJsdoc = require('swagger-jsdoc');
const VERSION = require('./version');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'VaHire API',
      version: VERSION.number,
      description: VERSION.description,
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server"
      },
      {
        url: "https://va-hire-backend.onrender.com",
        description: "Production server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the user'
            },
            firstname: {
              type: 'string',
              description: 'User\'s first name'
            },
            lastname: {
              type: 'string',
              description: 'User\'s last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User\'s email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'professional', 'recruiter'],
              description: 'User\'s role in the system'
            },
            profile: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'User\'s professional title'
                },
                skills: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'User\'s skills'
                },
                experience: {
                  type: 'string',
                  description: 'User\'s experience'
                },
                portfolio: {
                  type: 'string',
                  description: 'User\'s portfolio URL'
                },
                bio: {
                  type: 'string',
                  description: 'User\'s biography'
                },
                location: {
                  type: 'string',
                  description: 'User\'s location'
                }
              }
            },
            profileImage: {
              type: 'string',
              description: 'URL to user\'s profile image'
            },
            resume: {
              type: 'string',
              description: 'URL to user\'s resume'
            },
            receiveEmails: {
              type: 'boolean',
              description: 'Whether user wants to receive emails'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the user was created'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'User\'s last login time'
            },
            isProfileComplete: {
              type: 'boolean',
              description: 'Whether user has completed their profile'
            }
          }
        },
        Project: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the project'
            },
            title: {
              type: 'string',
              description: 'Project title'
            },
            description: {
              type: 'string',
              description: 'Project description'
            },
            budget: {
              type: 'number',
              description: 'Project budget'
            },
            skillsRequired: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Required skills for the project'
            },
            owner: {
              $ref: '#/components/schemas/User'
            },
            assignedTo: {
              $ref: '#/components/schemas/User'
            },
            status: {
              type: 'string',
              enum: ['en cours', 'terminé', 'payé'],
              description: 'Project status'
            },
            attachments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    description: 'Attachment URL'
                  },
                  filename: {
                    type: 'string',
                    description: 'Attachment filename'
                  },
                  mimetype: {
                    type: 'string',
                    description: 'Attachment MIME type'
                  },
                  uploadedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'When the attachment was uploaded'
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the project was created'
            }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the course'
            },
            instructor: {
              $ref: '#/components/schemas/User'
            },
            title: {
              type: 'string',
              description: 'Course title'
            },
            description: {
              type: 'string',
              description: 'Course description'
            },
            price: {
              type: 'number',
              description: 'Course price'
            },
            duration: {
              type: 'string',
              description: 'Course duration'
            },
            level: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced'],
              description: 'Course level'
            },
            topics: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Topic title'
                  },
                  description: {
                    type: 'string',
                    description: 'Topic description'
                  },
                  videoUrl: {
                    type: 'string',
                    description: 'Topic video URL'
                  },
                  duration: {
                    type: 'string',
                    description: 'Topic duration'
                  }
                }
              }
            },
            requirements: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Course requirements'
            },
            objectives: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Course objectives'
            },
            enrolledStudents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  student: {
                    $ref: '#/components/schemas/User'
                  },
                  enrolledAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'When the student enrolled'
                  },
                  progress: {
                    type: 'number',
                    description: 'Student progress in the course'
                  }
                }
              }
            },
            rating: {
              type: 'number',
              description: 'Course rating'
            },
            reviews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  student: {
                    $ref: '#/components/schemas/User'
                  },
                  rating: {
                    type: 'number',
                    description: 'Review rating'
                  },
                  comment: {
                    type: 'string',
                    description: 'Review comment'
                  },
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'When the review was created'
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the course was created'
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the notification'
            },
            recipient: {
              $ref: '#/components/schemas/User'
            },
            type: {
              type: 'string',
              enum: [
                'project_application',
                'project_assigned',
                'project_completed',
                'payment_received',
                'review_received',
                'message_received',
                'system'
              ],
              description: 'Notification type'
            },
            title: {
              type: 'string',
              description: 'Notification title'
            },
            message: {
              type: 'string',
              description: 'Notification message'
            },
            read: {
              type: 'boolean',
              description: 'Whether the notification has been read'
            },
            data: {
              type: 'object',
              description: 'Additional notification data'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the notification was created'
            }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the review'
            },
            project: {
              $ref: '#/components/schemas/Project'
            },
            reviewer: {
              $ref: '#/components/schemas/User'
            },
            reviewed: {
              $ref: '#/components/schemas/User'
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'Review rating (1-5)'
            },
            comment: {
              type: 'string',
              description: 'Review comment'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the review was created'
            }
          }
        },
        Conversation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the conversation'
            },
            participants: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User'
              },
              description: 'Conversation participants'
            },
            messages: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sender: {
                    $ref: '#/components/schemas/User'
                  },
                  content: {
                    type: 'string',
                    description: 'Message content'
                  },
                  read: {
                    type: 'boolean',
                    description: 'Whether the message has been read'
                  },
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'When the message was created'
                  }
                }
              }
            },
            lastMessage: {
              type: 'string',
              format: 'date-time',
              description: 'When the last message was sent'
            },
            project: {
              $ref: '#/components/schemas/Project'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the conversation was created'
            }
          }
        },
        Recommendation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the recommendation'
            },
            fromUser: {
              $ref: '#/components/schemas/User'
            },
            toUser: {
              $ref: '#/components/schemas/User'
            },
            message: {
              type: 'string',
              description: 'Recommendation message'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the recommendation was created'
            }
          }
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the post'
            },
            title: {
              type: 'string',
              description: 'Post title'
            },
            content: {
              type: 'string',
              description: 'Post content'
            },
            post_image_url: {
              type: 'string',
              description: 'Post image URL'
            },
            slug: {
              type: 'string',
              description: 'Post slug'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the post was created'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The unique identifier for the message'
            },
            sender: {
              $ref: '#/components/schemas/User'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            read: {
              type: 'boolean',
              description: 'Whether the message has been read'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the message was created'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 