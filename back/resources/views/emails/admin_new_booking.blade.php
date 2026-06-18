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
            color: #8b5e34;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }

        th {
            width: 20%;
            color: #555;
            font-weight: 600;
        }

        .important {
            font-weight: bold;
            color: #8b5e34;
        }

        .notes-box {
            margin-top: 15px;
            background-color: #fff9f0;
            padding: 10px;
        }

        table {
            width: 100%;
            table-layout: fixed;
            /* يمنع الجدول من التمدد بشكل عشوائي */
            border-collapse: collapse;
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f4f1eb;">
    <div class="main-wrapper" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}"
        style="direction: {{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}; text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }}; padding: 10px 5px;">
        <div class="container">
            <h2>{{ __('messages.admin_new_booking_title') }}</h2>
            <p>{{ __('messages.admin_new_booking_subtitle') }}</p>

            <table style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.customer_name_label') }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ $booking->customer_name }}</td>
                </tr>
                <tr>
                    <th style="text-align:'left';">
                        {{ __('messages.phone_label') }}</th>
                    <td style="text-align: 'left';">
                        <a dir="ltr" href="tel:{{ $booking->customer_phone }}"
                            style="color: #333; text-decoration: none; text-align: 'left';">
                            {{ $booking->customer_phone }}
                        </a>
                    </td>
                </tr>
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }}; ">
                        {{ __('messages.email_label') }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }}; ">
                        {{ $booking->customer_email }}</td>
                </tr>
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.nationality_label') }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ $booking->nationality }}</td>
                </tr>
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.age_gender_label') }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">{{ $booking->age }}
                        {{ __('messages.years') }} / {{ __('messages.' . $booking->gender) }}</td>
                </tr>

                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.rooms_count') }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }}; font-weight: bold;">
                        {{ $booking->rooms_count }}</td>
                </tr>
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.double_beds_count_label') }}</th>
                    <td class="beds-highlight"
                        style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ $booking->double_beds_count }}</td>
                </tr>
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.single_beds_count_label') }}</th>
                    <td class="beds-highlight"
                        style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ $booking->single_beds_count }}</td>
                </tr>
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.check_in_label') }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ \Carbon\Carbon::parse($booking->check_in)->format('Y-m-d') }}</td>
                </tr>
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.check_out_label') }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ \Carbon\Carbon::parse($booking->check_out)->format('Y-m-d') }}</td>
                </tr>
                <tr>
                    <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ __('messages.guests_count_label') }}</th>
                    <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                        {{ $booking->guests_count }}</td>
                </tr>

                @if (!empty($booking->requested_services))
                    <tr>
                        <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ __('messages.requested_services_label') }}</th>
                        <td style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ implode('، ',array_map(function ($service) {return __('messages.' . $service, ['default' => $service]);}, $booking->requested_services)) }}
                        </td>
                    </tr>
                @endif

                @if (!empty($booking->notes))
                    <tr>
                        <th style="text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ __('messages.customer_notes_label') }}</th>
                        <td class="notes-box"
                            style="word-wrap: break-word; border-{{ app()->getLocale() == 'ar' ? 'right' : 'left' }}: 4px solid #d4af37; text-align: {{ app()->getLocale() == 'ar' ? 'right' : 'left' }};">
                            {{ $booking->notes }}
                        </td>
                    </tr>
                @endif
            </table>
        </div>
    </div>
</body>

</html>
