"use client";

import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeAddSchema } from "@/lib";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AddEmployee } from "@/actions/auth/add-employee";

interface AddEmployeeFormProps {
  onSuccess?: () => void;
}

export function AddEmployeeForm({ onSuccess }: AddEmployeeFormProps) {
  return (
    <CardWrapper
      headerLabel="Add New Employee"
      headerdescription="Create a new employee account"
      isDisabled={isPending}
      backButtonHref="/auth/login"
      backButtonLable="Already have account?"
    ></CardWrapper>
  );
}
