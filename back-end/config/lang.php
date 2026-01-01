<?php
// config/lang.php

function getLang() {
    $lang = 'en';
    
    // Check for lang parameter in GET/POST
    if (isset($_GET['lang'])) {
        $lang = $_GET['lang'];
    } elseif (isset($_POST['lang'])) {
        $lang = $_POST['lang'];
    } else {
        // Check for Accept-Language header
        $headers = getallheaders();
        if (isset($headers['Accept-Language'])) {
            $lang = substr($headers['Accept-Language'], 0, 2);
        }
    }
    
    return in_array($lang, ['en', 'ar']) ? $lang : 'en';
}

$translations = [
    'en' => [
        'mobile_password_required' => 'Mobile number and password required',
        'login_success' => 'Login successful',
        'incorrect_login' => 'Incorrect login details',
        'server_error' => 'Server error',
        'missing_data' => 'Missing data',
        'payer_not_found' => 'Payer not found',
        'sent_successfully' => 'Sent successfully',
        'payment_request' => 'Payment Request',
        'new_money_request' => 'New money request received',
        'transfer_success' => 'Transfer successful',
        'insufficient_balance' => 'Insufficient balance',
        'invalid_amount' => 'Invalid amount',
        'user_not_found' => 'User not found',
        'profile_updated' => 'Profile updated successfully',
        'avatar_uploaded' => 'Avatar uploaded successfully',
        'invalid_file' => 'Invalid file type or size',
        'unauthorized' => 'Unauthorized',
        'transaction_completed' => 'Transaction completed',
        'phone_not_registered' => 'This phone number is not registered',
        'cannot_transfer_self' => 'You cannot transfer to yourself',
        'notifications_read' => 'Notifications marked as read',
        'user_deleted' => 'User deleted successfully',
        'balance_updated' => 'Balance updated successfully',
        'user_updated' => 'User updated successfully',
        'all_fields_required' => 'All fields are required',
        'account_created' => 'Account created successfully',
        'phone_already_registered' => 'The mobile number is already registered',
        'name_updated' => 'Name updated successfully',
        'password_changed' => 'Password changed successfully',
        'current_password_incorrect' => 'Current password incorrect',
        'account_deleted' => 'Account deleted',
        'bill_deleted' => 'Bill deleted successfully',
        'payment_success' => 'Payment successful!',
        'invalid_request' => 'Invalid Request',
        'money_sent' => 'Money Sent',
        'money_received' => 'Money Received',
        'sent_to' => 'Sent to ',
        'received_from' => 'Received from ',
        'transfer_to' => 'Transfer to ',
        'new_password_same' => 'New password cannot be the same as the current password',
        'user_id_required' => 'User ID is required',
        'record_deleted' => 'Record deleted successfully',
        'record_not_found' => 'Record not found',
        'insufficient_balance_with_amount' => 'Insufficient balance. Current: ',
    ],
    'ar' => [
        'mobile_password_required' => 'رقم الهاتف وكلمة المرور مطلوبان',
        'login_success' => 'تم تسجيل الدخول بنجاح',
        'incorrect_login' => 'بيانات الدخول غير صحيحة',
        'server_error' => 'خطأ في الخادم',
        'missing_data' => 'بيانات مفقودة',
        'payer_not_found' => 'لم يتم العثور على الدافع',
        'sent_successfully' => 'تم الإرسال بنجاح',
        'payment_request' => 'طلب دفع',
        'new_money_request' => 'تم استلام طلب أموال جديد',
        'transfer_success' => 'تم التحويل بنجاح',
        'insufficient_balance' => 'رصيد غير كافٍ',
        'invalid_amount' => 'مبلغ غير صالح',
        'user_not_found' => 'المستخدم غير موجود',
        'profile_updated' => 'تم تحديث الملف الشخصي بنجاح',
        'avatar_uploaded' => 'تم رفع الصورة الشخصية بنجاح',
        'invalid_file' => 'نوع الملف أو حجمه غير صالح',
        'unauthorized' => 'غير مصرح به',
        'transaction_completed' => 'تمت العملية بنجاح',
        'phone_not_registered' => 'هذا الرقم غير مسجل',
        'cannot_transfer_self' => 'لا يمكنك التحويل لنفسك',
        'notifications_read' => 'تم تحديد الإشعارات كمقروءة',
        'user_deleted' => 'تم حذف المستخدم بنجاح',
        'balance_updated' => 'تم تحديث الرصيد بنجاح',
        'user_updated' => 'تم تحديث بيانات المستخدم بنجاح',
        'all_fields_required' => 'جميع الحقول مطلوبة',
        'account_created' => 'تم إنشاء الحساب بنجاح',
        'phone_already_registered' => 'رقم الهاتف مسجل بالفعل',
        'name_updated' => 'تم تحديث الاسم بنجاح',
        'password_changed' => 'تم تغيير كلمة المرور بنجاح',
        'current_password_incorrect' => 'كلمة المرور الحالية غير صحيحة',
        'account_deleted' => 'تم حذف الحساب',
        'bill_deleted' => 'تم حذف الفاتورة بنجاح',
        'payment_success' => 'تم الدفع بنجاح!',
        'invalid_request' => 'طلب غير صالح',
        'money_sent' => 'تم إرسال الأموال',
        'money_received' => 'تم استلام الأموال',
        'sent_to' => 'أرسلت إلى ',
        'received_from' => 'استلمت من ',
        'transfer_to' => 'تحويل إلى ',
        'new_password_same' => 'كلمة المرور الجديدة لا يمكن أن تكون نفس كلمة المرور الحالية',
        'user_id_required' => 'معرف المستخدم مطلوب',
        'record_deleted' => 'تم حذف السجل بنجاح',
        'record_not_found' => 'السجل غير موجود',
        'insufficient_balance_with_amount' => 'رصيد غير كافٍ. الحالي: ',
    ]
];

$current_lang = getLang();

function __($key) {
    global $translations, $current_lang;
    return $translations[$current_lang][$key] ?? $key;
}
