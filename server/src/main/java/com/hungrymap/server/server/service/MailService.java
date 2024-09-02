package com.hungrymap.server.server.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MailService {

    private final JavaMailSender JMSender;
    @Value("${spring.mail.username}")
    private static String senderEmail;
    private static int number;

    @Autowired
    public MailService(JavaMailSender jmSender) {
        JMSender = jmSender;
    }


    public int sendMail(String mail) {
        number = (int)(Math.random() * (90000)) + 100000;
        MimeMessage message = JMSender.createMimeMessage();
        try {
            message.setFrom(senderEmail);
            message.setRecipients( MimeMessage.RecipientType.TO, mail );
            message.setSubject("이메일 인증");
            String body = "";
            body += "<h3>" + "이메일 인증 코드 : " + "</h3>";
            body += "<h1>" + number + "</h1>";
            body += "<h3>" + "감사합니다." + "</h3>";
            message.setText(body,"UTF-8", "html");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        JMSender.send(message);
        return number;
    }
}
