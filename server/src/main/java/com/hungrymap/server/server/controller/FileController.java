package com.hungrymap.server.server.controller;

import java.io.IOException;
import java.util.HashMap;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hungrymap.server.server.security.service.S3UploadService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {
    private final S3UploadService sus;

    @PostMapping("")
    public HashMap<String, Object> fileupload(@RequestParam("file") MultipartFile file){
        HashMap<String, Object> result = new HashMap<>();
        try{
            String uploadFilePathName = sus.saveFile(file);
            result.put("savefilename", uploadFilePathName);
        } catch(IOException e){
            throw new RuntimeException(e);
        }
        return result;
    }
}
