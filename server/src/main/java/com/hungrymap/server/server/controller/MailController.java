package com.hungrymap.server.server.controller;

import com.hungrymap.server.server.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/mail")
public class MailController {

    private final MailService ms;
    private int number;

    @Autowired
    public MailController(MailService ms) {
        this.ms = ms;
    }


    @PostMapping("/emailsend")
    public HashMap<String, Object> mailSend(@RequestParam("email") String mail) {
        HashMap<String, Object> result = new HashMap<>();
        try{
            number = ms.sendMail( mail );
            result.put("msg", "success");

            System.out.println("이메일 인증 코드 = " + number);
        }catch(Exception e){
            result.put("msg", "fail");
        }
        return result;
    }

    @PostMapping("/codecheck")
    public HashMap<String, Object> codecheck(@RequestParam("emailcode") String emailcode) {
        HashMap<String, Object> result = new HashMap<>();
        String num = String.valueOf(number);
        if( num.equals(emailcode) ){
            result.put("msg", "OK");
        }else{
            result.put("msg", "FAIL");
        }
        return result;
    }
}
