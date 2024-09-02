package com.hungrymap.server.server.controller;

import com.hungrymap.server.server.service.S3UploadService;
import jakarta.servlet.ServletContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileController {
    private final S3UploadService sus;
//    private final ServletContext servletContext;
//
//    @Autowired
//    public FileController(ServletContext servletContext) {
//        this.servletContext = servletContext;
//    }

//    @PostMapping("")
//    public HashMap<String, Object> fileupload(@RequestParam("file") MultipartFile file){
//        HashMap<String, Object> result = new HashMap<>();
//
//        String path = servletContext.getRealPath("/images");
//
//        Calendar today = Calendar.getInstance();
//        long dt = today.getTimeInMillis();
//
//        String filename = file.getOriginalFilename();
//        String fn1 = filename.substring(0, filename.indexOf("."));
//        String fn2 = filename.substring(filename.indexOf("."));
//        String uploadPath = path + "/" + fn1 + dt + fn2;
//
//        try{
//            file.transferTo(new File(uploadPath));
//            result.put("savefilename", fn1 + dt + fn2);
//        } catch(IllegalStateException | IOException e){
//            e.printStackTrace();
//        }
//
//        return result;
//    }

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
