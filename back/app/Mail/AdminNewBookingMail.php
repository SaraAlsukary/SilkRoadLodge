<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Booking;
use Illuminate\Mail\Mailables\Address;
class AdminNewBookingMail extends Mailable
{
    use Queueable, SerializesModels;

    // تعريف المتغير ليكون متاحاً في قالب الـ Blade تلقائياً
    public $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function envelope(): Envelope
    {
            return new Envelope(
                subject: __('messages.new_booking_notification'),
                replyTo: [
                    new Address($this->booking->customer_email, $this->booking->customer_name)
                ],
            );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin_new_booking', // مسار ملف الـ Blade
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
