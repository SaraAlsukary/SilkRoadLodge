<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingCancelledMail extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            // يمكنك استخدام الترجمة هنا لتغيير عنوان الإيميل حسب اللغة
            subject: __('messages.cancellation_email_subject', [], app()->getLocale()),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking_cancelled',
        );
    }
}
