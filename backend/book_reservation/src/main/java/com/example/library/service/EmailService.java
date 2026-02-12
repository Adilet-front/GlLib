package com.example.library.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final org.springframework.mail.javamail.JavaMailSender mailSender;

    // Инъекция конфига из твоего yaml
    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    public void send(String to, String text) {
        org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Confirm your email");
        message.setText(text);
        mailSender.send(message);
    }
}