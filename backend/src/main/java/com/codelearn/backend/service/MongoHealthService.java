package com.codelearn.backend.service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class MongoHealthService {

    private final MongoTemplate mongoTemplate;

    public MongoHealthService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public Map<String, Object> health() {
        Map<String, Object> response = new LinkedHashMap<>();
        try {
            Document result = CompletableFuture
                .supplyAsync(() -> mongoTemplate.executeCommand(new Document("ping", 1)))
                .orTimeout(3, TimeUnit.SECONDS)
                .join();
            Object ok = result.get("ok");
            boolean connected = false;
            if (ok instanceof Number number) {
                connected = number.doubleValue() >= 1.0;
            }

            response.put("mongoStatus", connected ? "UP" : "DOWN");
            response.put("mongoConnected", connected);
            response.put("mongoDatabase", mongoTemplate.getDb().getName());
            return response;
        } catch (Exception ex) {
            response.put("mongoStatus", "DOWN");
            response.put("mongoConnected", false);
            response.put("mongoError", ex.getMessage());
            return response;
        }
    }
}
