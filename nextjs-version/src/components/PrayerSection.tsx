"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Flame, Star, Users } from "lucide-react";
import { useState } from "react";

const PrayerSection = () => {
  const [prayerForm, setPrayerForm] = useState({
    name: "",
    email: "",
    prayer: "",
    type: "general"
  });

  const prayerTypes = [
    { id: "general", label: "General Blessing", icon: Heart, price: "Free" },
    { id: "special", label: "Special Prayer", icon: Star, price: "₹101" },
    { id: "havan", label: "Havan Ceremony", icon: Flame, price: "₹501" },
    { id: "group", label: "Group Prayer", icon: Users, price: "₹1001" }
  ];


  return null;
};

export default PrayerSection;
