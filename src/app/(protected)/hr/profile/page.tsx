"use client";

import { useState, useEffect } from "react";
import { getHRProfile, updateHRProfile } from "@/actions/hr/update-profile";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, X, Plus } from "lucide-react";

interface HRData {
  user: {
    id: string;
    name: string;
    email: string;
    companyName?: string;
    companyLogo?: string;
    phoneNumber?: string;
    image?: string;
  };
  hrDetails?: {
    department?: string;
    designation?: string;
    manager?: string;
    about?: string;
    jobFavorites?: string;
    interests?: string;
    skills?: string[];
    certifications?: string[];
    resume?: string;
  };
  salaryInfo?: {
    monthlyWage?: number;
    yearlyWage?: number;
    baseSalary?: number;
    hraAllowance?: number;
    standardAllowance?: number;
    performanceBonus?: number;
    pfContribution?: number;
    professionalTax?: number;
    workingDaysPerMonth?: number;
    breakTimePerDay?: number;
  };
}

interface FormData {
  name: string;
  phoneNumber: string;
  companyName: string;
  department: string;
  designation: string;
  manager: string;
  about: string;
  jobFavorites: string;
  interests: string;
  skills: string[];
  certifications: string[];
  monthlyWage: string;
  yearlyWage: string;
  baseSalary: string;
  hraAllowance: string;
  standardAllowance: string;
  performanceBonus: string;
  pfContribution: string;
  professionalTax: string;
  workingDaysPerMonth: string;
  breakTimePerDay: string;
}

export default function HRProfilePage() {
  const [data, setData] = useState<HRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingTab, setSavingTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [skillInput, setSkillInput] = useState("");
  const [certInput, setCertInput] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phoneNumber: "",
    companyName: "",
    department: "",
    designation: "",
    manager: "",
    about: "",
    jobFavorites: "",
    interests: "",
    skills: [],
    certifications: [],
    monthlyWage: "",
    yearlyWage: "",
    baseSalary: "",
    hraAllowance: "",
    standardAllowance: "",
    performanceBonus: "",
    pfContribution: "",
    professionalTax: "",
    workingDaysPerMonth: "",
    breakTimePerDay: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await getHRProfile();
      setData(profile);

      setFormData({
        name: profile.user.name || "",
        phoneNumber: profile.user.phoneNumber || "",
        companyName: profile.user.companyName || "",
        department: profile.hrDetails?.department || "",
        designation: profile.hrDetails?.designation || "",
        manager: profile.hrDetails?.manager || "",
        about: profile.hrDetails?.about || "",
        jobFavorites: profile.hrDetails?.jobFavorites || "",
        interests: profile.hrDetails?.interests || "",
        skills: Array.isArray(profile.hrDetails?.skills)
          ? profile.hrDetails.skills
          : [],
        certifications: Array.isArray(profile.hrDetails?.certifications)
          ? profile.hrDetails.certifications
          : [],
        monthlyWage: profile.salaryInfo?.monthlyWage?.toString() || "",
        yearlyWage: profile.salaryInfo?.yearlyWage?.toString() || "",
        baseSalary: profile.salaryInfo?.baseSalary?.toString() || "",
        hraAllowance: profile.salaryInfo?.hraAllowance?.toString() || "",
        standardAllowance:
          profile.salaryInfo?.standardAllowance?.toString() || "",
        performanceBonus:
          profile.salaryInfo?.performanceBonus?.toString() || "",
        pfContribution: profile.salaryInfo?.pfContribution?.toString() || "",
        professionalTax: profile.salaryInfo?.professionalTax?.toString() || "",
        workingDaysPerMonth:
          profile.salaryInfo?.workingDaysPerMonth?.toString() || "",
        breakTimePerDay: profile.salaryInfo?.breakTimePerDay?.toString() || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (imageUrl: string) => {
    try {
      setSavingTab("overview");
      await updateHRProfile({ image: imageUrl });
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: { ...prev.user, image: imageUrl },
        };
      });
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error("Failed to update profile picture");
    } finally {
      setSavingTab(null);
    }
  };

  const handleLogoChange = async (logoUrl: string) => {
    try {
      setSavingTab("overview");
      await updateHRProfile({ companyLogo: logoUrl });
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          user: { ...prev.user, companyLogo: logoUrl },
        };
      });
      toast.success("Company logo updated");
    } catch (error) {
      toast.error("Failed to update company logo");
    } finally {
      setSavingTab(null);
    }
  };

  const handleSaveTab = async (tab: string) => {
    try {
      setSavingTab(tab);

      if (tab === "overview") {
        await updateHRProfile({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          companyName: formData.companyName,
        });
      } else if (tab === "personal") {
        await updateHRProfile({
          department: formData.department,
          designation: formData.designation,
          manager: formData.manager,
          about: formData.about,
          jobFavorites: formData.jobFavorites,
          interests: formData.interests,
          skills: formData.skills,
          certifications: formData.certifications,
        });
      } else if (tab === "salary") {
        await updateHRProfile({
          monthlyWage: formData.monthlyWage
            ? parseInt(formData.monthlyWage)
            : undefined,
          yearlyWage: formData.yearlyWage
            ? parseInt(formData.yearlyWage)
            : undefined,
          baseSalary: formData.baseSalary
            ? parseInt(formData.baseSalary)
            : undefined,
          hraAllowance: formData.hraAllowance
            ? parseInt(formData.hraAllowance)
            : undefined,
          standardAllowance: formData.standardAllowance
            ? parseInt(formData.standardAllowance)
            : undefined,
          performanceBonus: formData.performanceBonus
            ? parseInt(formData.performanceBonus)
            : undefined,
          pfContribution: formData.pfContribution
            ? parseInt(formData.pfContribution)
            : undefined,
          professionalTax: formData.professionalTax
            ? parseInt(formData.professionalTax)
            : undefined,
          workingDaysPerMonth: formData.workingDaysPerMonth
            ? parseInt(formData.workingDaysPerMonth)
            : undefined,
          breakTimePerDay: formData.breakTimePerDay
            ? parseInt(formData.breakTimePerDay)
            : undefined,
        });
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSavingTab(null);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const handleAddCertification = () => {
    if (certInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()],
      }));
      setCertInput("");
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-6">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-background px-2">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-6 p-6">
          <div className="flex items-start gap-6">
            <ImageUpload
              value={data.user.image}
              onChange={handleImageChange}
              disabled={savingTab === "overview"}
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{data.user.name}</h1>
              <p className="text-gray-600 mb-1">{data.user.email}</p>
              {data.user.companyName && (
                <p className="text-gray-600 mb-1 font-semibold">
                  {data.user.companyName}
                </p>
              )}
              {data.user.phoneNumber && (
                <p className="text-gray-600">{data.user.phoneNumber}</p>
              )}
              {formData.department && (
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Department:</span>{" "}
                  {formData.department}
                </p>
              )}
              {formData.designation && (
                <p className="text-gray-600">
                  <span className="font-semibold">Designation:</span>{" "}
                  {formData.designation}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Card>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="personal"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="salary"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Salary Info
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      disabled={savingTab === "overview"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company Name
                    </label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      placeholder="Enter company name"
                      disabled={savingTab === "overview"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="+1 (555) 000-0000"
                      disabled={savingTab === "overview"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <Input
                      value={data.user.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Company Logo</h3>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <ImageUpload
                      value={data.user.companyLogo}
                      onChange={handleLogoChange}
                      disabled={savingTab === "overview"}
                      label="Upload Company Logo"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Upload your company logo. This will be displayed on all
                      employee dashboards and documents.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSaveTab("overview")}
                disabled={savingTab === "overview"}
              >
                {savingTab === "overview" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </TabsContent>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Department
                    </label>
                    <Input
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      placeholder="e.g., Human Resources"
                      disabled={savingTab === "personal"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Designation
                    </label>
                    <Input
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                      placeholder="e.g., HR Manager"
                      disabled={savingTab === "personal"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Manager
                    </label>
                    <Input
                      value={formData.manager}
                      onChange={(e) =>
                        setFormData({ ...formData, manager: e.target.value })
                      }
                      placeholder="Manager name"
                      disabled={savingTab === "personal"}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">About You</h3>
                <Textarea
                  value={formData.about}
                  onChange={(e) =>
                    setFormData({ ...formData, about: e.target.value })
                  }
                  placeholder="Tell us about yourself"
                  disabled={savingTab === "personal"}
                  className="min-h-24"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  What I Love About My Job
                </h3>
                <Textarea
                  value={formData.jobFavorites}
                  onChange={(e) =>
                    setFormData({ ...formData, jobFavorites: e.target.value })
                  }
                  placeholder="Share what you love about your job"
                  disabled={savingTab === "personal"}
                  className="min-h-20"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  My Interests & Hobbies
                </h3>
                <Textarea
                  value={formData.interests}
                  onChange={(e) =>
                    setFormData({ ...formData, interests: e.target.value })
                  }
                  placeholder="Share your interests and hobbies"
                  disabled={savingTab === "personal"}
                  className="min-h-20"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add a skill"
                    disabled={savingTab === "personal"}
                  />
                  <Button
                    onClick={handleAddSkill}
                    disabled={savingTab === "personal"}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        disabled={savingTab === "personal"}
                        className="hover:text-blue-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCertification();
                      }
                    }}
                    placeholder="Add a certification"
                    disabled={savingTab === "personal"}
                  />
                  <Button
                    onClick={handleAddCertification}
                    disabled={savingTab === "personal"}
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      {cert}
                      <button
                        onClick={() => handleRemoveCertification(index)}
                        disabled={savingTab === "personal"}
                        className="hover:text-green-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleSaveTab("personal")}
                disabled={savingTab === "personal"}
              >
                {savingTab === "personal" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </TabsContent>

            {/* Salary Info Tab */}
            <TabsContent value="salary" className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  This section is only visible to HR administrators. Salary
                  information is confidential and securely stored.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Monthly & Yearly Wages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Monthly Wage
                    </label>
                    <Input
                      type="number"
                      value={formData.monthlyWage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monthlyWage: e.target.value,
                        })
                      }
                      placeholder="50000"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Yearly Wage
                    </label>
                    <Input
                      type="number"
                      value={formData.yearlyWage}
                      onChange={(e) =>
                        setFormData({ ...formData, yearlyWage: e.target.value })
                      }
                      placeholder="600000"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Working Days & Break Time
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Working Days Per Month
                    </label>
                    <Input
                      type="number"
                      value={formData.workingDaysPerMonth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          workingDaysPerMonth: e.target.value,
                        })
                      }
                      placeholder="22"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Break Time Per Day (minutes)
                    </label>
                    <Input
                      type="number"
                      value={formData.breakTimePerDay}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          breakTimePerDay: e.target.value,
                        })
                      }
                      placeholder="60"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Salary Components
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Base Salary
                    </label>
                    <Input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) =>
                        setFormData({ ...formData, baseSalary: e.target.value })
                      }
                      placeholder="40000"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      HRA Allowance
                    </label>
                    <Input
                      type="number"
                      value={formData.hraAllowance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hraAllowance: e.target.value,
                        })
                      }
                      placeholder="10000"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Standard Allowance
                    </label>
                    <Input
                      type="number"
                      value={formData.standardAllowance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          standardAllowance: e.target.value,
                        })
                      }
                      placeholder="5000"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Performance Bonus
                    </label>
                    <Input
                      type="number"
                      value={formData.performanceBonus}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          performanceBonus: e.target.value,
                        })
                      }
                      placeholder="5000"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Deductions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      PF Contribution (%)
                    </label>
                    <Input
                      type="number"
                      value={formData.pfContribution}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pfContribution: e.target.value,
                        })
                      }
                      placeholder="12"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Professional Tax
                    </label>
                    <Input
                      type="number"
                      value={formData.professionalTax}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          professionalTax: e.target.value,
                        })
                      }
                      placeholder="1000"
                      disabled={savingTab === "salary"}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleSaveTab("salary")}
                disabled={savingTab === "salary"}
              >
                {savingTab === "salary" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
