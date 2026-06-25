<!DOCTYPE html>
<html dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}" lang="{{ app()->getLocale() }}"
    xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f1eb;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            background-color: #ffffff;
        }

        h2 {
            /* استخدمنا لوناً يميل للأحمر الهادئ للدلالة على الإلغاء */
            color: #d9534f;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }

        .message-content {
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            table-layout: fixed;
        }

        th, td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        th {
            width: 30%;
            color: #555;
            font-weight: 600;
        }

        .footer-note {
            margin-top: 25px;
            font-style: italic;
            color: #8b5e34;
            text-align: center;
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f1eb;">
    <div class="main-wrapper" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}"
        style="direction: {{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}; text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }}; padding: 10px 5px;">
        <div class="container">
            <h2>{{ __('messages.cancellation_title') }}</h2>

            <div class="message-content">
                <p style="font-weight: bold; font-size: 18px; color: #333;">
                    {{ __('messages.hello') }} {{ $booking->customer_name }}،
                </p>

                <p>{{ __('messages.cancellation_confirmation') }}</p>
            </div>

            <table style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }}; background-color: #fff9f0; border-radius: 5px;">
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.check_in_label') ?? 'Check-in' }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ \Carbon\Carbon::parse($booking->check_in)->format('Y-m-d') }}</td>
                </tr>
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.check_out_label') ?? 'Check-out' }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ \Carbon\Carbon::parse($booking->check_out)->format('Y-m-d') }}</td>
                </tr>
            </table>

            <div class="footer-note">
                <p>{{ __('messages.hope_to_see_you_soon') }}</p>
            </div>
        </div>
    </div>
</body>

</html>
