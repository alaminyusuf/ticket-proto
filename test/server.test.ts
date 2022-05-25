process.env.NODE_ENV = 'test';
const nodemailer = require('nodemailer');
const express = require('express');
const request = require('supertest');
const server = require('../server');

describe('Ticket module', () => {
  const data = {
    email: 'test@test.com',
    message: 'this is from jest',
    name: 'jest',
    subject: 'jest test',
  };
  it('should send an email', async () => {
    server.use(express.json());
    const res = await request(server).post('/send').send(data);
    expect(res.statusCode).toEqual(302);
  }, 30000);
});
