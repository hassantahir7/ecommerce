import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createPaymentIntent(createPaymentDto: CreatePaymentDto) {
    try {
      const orderId = createPaymentDto.orderId
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(createPaymentDto.amount * 100), 
        currency: createPaymentDto.currency,
        metadata: { orderId },
      });

      await this.prismaService.payment.create({
        data: {
          orderId,
          paymentIntent: paymentIntent.id,
          amount: createPaymentDto.amount,
          currency: createPaymentDto.currency,
          status: paymentIntent.status,
          paymentMethod: paymentIntent.payment_method_types[0] || 'unknown',
        },
      });

      return {
        success: true,
        message: "Payment Intent created successfully!",
        clientSecret: paymentIntent.client_secret,
      };
    } catch (error) {
      throw new HttpException(
        `Error creating payment intent: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async handleWebhook(event: Stripe.Event) {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    if (event.type === 'payment_intent.created') {
      await this.prismaService.payment.updateMany({
        where: { paymentIntent: paymentIntent.id },
        data: { status: 'succeeded' },
      });
    } else if (event.type === 'payment_intent.payment_failed') {
      await this.prismaService.payment.updateMany({
        where: { paymentIntent: paymentIntent.id },
        data: { status: 'failed' },
      });
    }
  }

  verifyWebhookSignature(payload: any, signature: string, endpointSecret: string) {
    return this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  }
  
}
