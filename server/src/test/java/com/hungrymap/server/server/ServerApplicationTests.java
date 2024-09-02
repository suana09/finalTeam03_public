package com.hungrymap.server.server;

import com.hungrymap.server.server.security.CustomSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
class ServerApplicationTests {
    private final CustomSecurityConfig csconfig;

    @Autowired
    ServerApplicationTests(CustomSecurityConfig csconfig) {
        this.csconfig = csconfig;
    }

    @Test
    void contextLoads() {
        PasswordEncoder pe = csconfig.passwordEncoder();
        System.out.println(pe.encode("1234"));
    }

}
