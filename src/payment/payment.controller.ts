import { Controller, Post, Body, Headers, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEndpoints } from 'src/common/endpoints/payment.endpoint';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post(PaymentEndpoints.createPaymentIntent)
  @ApiOperation({
    summary: 'Create a payment intent',
    description: 'Creates a new payment intent using the provided payment details.',
  })
  async createPaymentIntent(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPaymentIntent(createPaymentDto);
  }

  @Post(PaymentEndpoints.webhook)
  @ApiOperation({
    summary: 'Handle Stripe webhook events',
    description: 'Handles incoming webhook events from Stripe, verifying the signature and processing the event.',
  })
  async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req) {
    const payload = req.body;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = this.paymentService.verifyWebhookSignature(
        payload,
        signature,
        endpointSecret,
      );

      return this.paymentService.handleWebhook(event);
    } catch (err) {
      throw new HttpException('Webhook signature verification failed', HttpStatus.BAD_REQUEST);
    }
  }
}
