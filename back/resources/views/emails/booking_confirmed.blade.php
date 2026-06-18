<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>{{ __('messages.booking_confirmation_subject') }}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #2c1e16;
            background-color: #f4f1eb;
            margin: 0;
            padding: 0;
            line-height: 1.6;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        .main-wrapper {
            padding: 40px 20px;
            background-color: #f4f1eb;
        }

        .container {
            width: 100%;
            max-width: 650px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            border: 1px solid #e8e1d7;
        }

        .header {
            background: #8b5e34;
            background: linear-gradient(135deg, #8b5e34, #6b4423);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }

        .header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        .content {
            padding: 35px 30px;
        }

        .greeting {
            font-size: 18px;
            font-weight: bold;
            color: #8b5e34;
            margin-bottom: 15px;
        }

        .details {
            margin-top: 25px;
            border-collapse: collapse;
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e8e1d7;
            table-layout: fixed;
        }

        .details td,
        .details th {
            border-bottom: 1px solid #e8e1d7;
            padding: 14px 18px;
        }

        .details tr:last-child th,
        .details tr:last-child td {
            border-bottom: none;
        }

        .details th {
            background-color: #faf7f2;
            width: 40%;
            font-weight: 600;
            color: #5a3d22;
        }

        .details td {
            font-weight: 500;
        }

        .beds-highlight {
            font-weight: 700;
            color: #8b5e34;
        }

        .service-badge {
            display: inline-block;
            background-color: #f4f1eb;
            color: #6b4423;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
            margin: 4px 2px;
            border: 1px solid #e8e1d7;
            font-weight: 600;
        }

        .notes-box {
            margin-top: 25px;
            background-color: #fff9f0;
            padding: 18px;
            border-radius: 8px;
        }

        .notes-box h4 {
            margin: 0 0 8px 0;
            color: #8b5e34;
            font-size: 15px;
        }

        .notes-box p {
            margin: 0;
            font-size: 14px;
            color: #4a3b32;
            font-style: italic;
        }

        .footer {
            background-color: #faf7f2;
            text-align: center;
            font-size: 13px;
            color: #888;
            border-top: 1px solid #e8e1d7;
            padding: 20px;
        }

        @media only screen and (max-width: 600px) {
            .main-wrapper {
                padding: 10px !important;
            }

            .container {
                border-radius: 8px !important;
            }

            .content,
            .header {
                padding: 20px 15px !important;
            }

            .header h2 {
                font-size: 20px !important;
            }

            .details,
            .details tbody,
            .details tr,
            .details th,
            .details td {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box !important;
            }

            .details tr {
                border-bottom: 1px solid #e8e1d7 !important;
            }

            .details tr:last-child {
                border-bottom: none !important;
            }

            .details th {
                border-bottom: none !important;
                padding-bottom: 4px !important;
            }

            .details td {
                border-bottom: none !important;
                padding-top: 0 !important;
                padding-bottom: 14px !important;
                font-size: 15px !important;
            }
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f1eb;">
    <div class="main-wrapper" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}"
        style="direction: {{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}; text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
        <div class="container">
            <div class="header">
                <h2>{{ __('messages.hotel_name', ['default' => 'نزل طريق الحرير']) }}</h2>
            </div>
            <div class="content">
                <div class="greeting">{{ __('messages.greeting', ['name' => $booking->customer_name]) }}</div>
                <p style="color: #555;">
                    {{ __('messages.booking_success_msg', ['default' => 'يسعدنا تأكيد حجزك لدينا. تفضل بالاطلاع على تفاصيل الحجز أدناه:']) }}
                </p>

                <table class="details" style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                    <tr>
                        <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ __('messages.check_in', ['default' => 'تاريخ الدخول']) }}</th>
                        <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ \Carbon\Carbon::parse($booking->check_in)->format('Y-m-d') }}</td>
                    </tr>
                    <tr>
                        <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ __('messages.check_out', ['default' => 'تاريخ الخروج']) }}</th>
                        <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ \Carbon\Carbon::parse($booking->check_out)->format('Y-m-d') }}</td>
                    </tr>
                    <tr>
                        <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ __('messages.rooms_count', ['default' => 'عدد الغرف']) }}</th>
                        <td
                            style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }}; font-weight: bold;">
                            {{ $booking->rooms_count }}</td>
                    </tr>

                    <tr>
                        <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ __('messages.double_beds_count_label') }}</th>
                        <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ $booking->double_beds_count }}</td>
                    </tr>
                    <tr>
                        <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ __('messages.single_beds_count_label') }}</th>
                        <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ $booking->single_beds_count }}</td>
                    </tr>

                    <tr>
                        <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ __('messages.guests_count', ['default' => 'عدد الضيوف']) }}</th>
                        <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ $booking->guests_count }}</td>
                    </tr>

                    @if (
                        !empty($booking->requested_services) &&
                            is_array($booking->requested_services) &&
                            count($booking->requested_services) > 0)
                        <tr>
                            <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                                {{ __('messages.requested_services', ['default' => 'الخدمات الإضافية']) }}</th>
                            <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                                @foreach ($booking->requested_services as $service)
                                    <span
                                        class="service-badge">{{ __('messages.' . $service, ['default' => ucfirst(str_replace('_', ' ', $service))]) }}</span>
                                @endforeach
                            </td>
                        </tr>
                    @endif
                </table>

                @if (!empty($booking->notes))
                    <div class="notes-box"
                        style="border-{{ app()->getLocale() == 'ar' ? 'right' : 'left' }}: 4px solid #d4af37; word-wrap: break-word; overflow-wrap: break-word;">
                        <h4>{{ __('messages.special_notes', ['default' => 'ملاحظاتك الخاصة:']) }}</h4>
                        <p style="word-break: break-word;">"{{ $booking->notes }}"</p>
                    </div>
                @endif
                <p style="margin-top: 30px; font-weight: 600; text-align: center; color: #8b5e34;">
                    {{ __('messages.looking_forward', ['default' => 'نتطلع بشوق للترحيب بك قريباً!']) }}
                </p>
            </div>
            <div class="footer">
                <p style="margin: 0;">
                    {{ __('messages.automated_email_footer', ['default' => 'هذه رسالة تلقائية، يرجى عدم الرد عليها مباشرة.']) }}
                </p>
            </div>
        </div>
    </div>
</body>

</html>
