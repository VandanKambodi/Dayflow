"use client";

import { useState, useEffect } from "react";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
  updateEmployeeDetails,
} from "@/actions/employee/update-profile";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfilePageSkeleton } from "@/components/skeletons";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageInitials } from "@/lib/cloudinary";
import { Loader2, X } from "lucide-react";

interface EmployeeData {
  user: {
    name: string;
    email: string;
    phoneNumber?: string;
    image?: string;
  };
  employeeDetails: any;
}

interface FormData {
  personal: {
    dateOfBirth: string;
    nationality: string;
    gender: string;
    maritalStatus: string;
    mailingAddress: string;
  };
  professional: {
    dateOfJoining: string;
    department: string;
    designation: string;
    location: string;
    about: string;
    interests: string;
  };
  security: {
    panNumber: string;
    aadharNumber: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  skills: string[];
}

export default function EmployeeProfilePage() {
  const [data, setData] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingTab, setSavingTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState<FormData>({
    personal: {
      dateOfBirth: "",
      nationality: "",
      gender: "",
      maritalStatus: "",
      mailingAddress: "",
    },
    professional: {
      dateOfJoining: "",
      department: "",
      designation: "",
      location: "",
      about: "",
      interests: "",
    },
    security: {
      panNumber: "",
      aadharNumber: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
    },
    skills: [],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await getEmployeeProfile();
      setData(profile);

      // Initialize form data with profile data
      if (profile.employeeDetails) {
        const details = profile.employeeDetails;
        setFormData({
          personal: {
            dateOfBirth: details.dateOfBirth
              ? new Date(details.dateOfBirth).toISOString().split("T")[0]
              : "",
            nationality: details.nationality || "",
            gender: details.gender || "",
            maritalStatus: details.maritalStatus || "",
            mailingAddress: details.mailingAddress || "",
          },
          professional: {
            dateOfJoining: details.dateOfJoining
              ? new Date(details.dateOfJoining).toISOString().split("T")[0]
              : "",
            department: details.department || "",
            designation: details.designation || "",
            location: details.location || "",
            about: details.about || "",
            interests: details.interests || "",
          },
          security: {
            panNumber: details.panNumber || "",
            aadharNumber: details.aadharNumber || "",
            accountNumber: details.accountNumber || "",
            bankName: details.bankName || "",
            ifscCode: details.ifscCode || "",
          },
          skills: Array.isArray(details.skills) ? details.skills : [],
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (imageUrl: string) => {
    try {
      setSaving(true);
      await updateEmployeeProfile({ image: imageUrl });
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
      setSaving(false);
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

  const handleSaveTab = async (tab: string) => {
    try {
      setSavingTab(tab);

      if (tab === "personal") {
        await updateEmployeeDetails({
          dateOfBirth: formData.personal.dateOfBirth,
          nationality: formData.personal.nationality,
          gender: formData.personal.gender,
          maritalStatus: formData.personal.maritalStatus,
          mailingAddress: formData.personal.mailingAddress,
        });
      } else if (tab === "professional") {
        await updateEmployeeDetails({
          dateOfJoining: formData.professional.dateOfJoining,
          department: formData.professional.department,
          designation: formData.professional.designation,
          location: formData.professional.location,
          about: formData.professional.about,
          interests: formData.professional.interests,
        });
      } else if (tab === "security") {
        await updateEmployeeDetails({
          dateOfBirth: "", // dummy to trigger upsert
          panNumber: formData.security.panNumber,
          aadharNumber: formData.security.aadharNumber,
          accountNumber: formData.security.accountNumber,
          bankName: formData.security.bankName,
          ifscCode: formData.security.ifscCode,
        });
      } else if (tab === "skills") {
        await updateEmployeeDetails({
          skills: formData.skills,
        });
      }

      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save changes");
    } finally {
      setSavingTab(null);
    }
  };

  if (loading) {
    return <ProfilePageSkeleton />;
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
              disabled={saving}
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{data.user.name}</h1>
              <p className="text-gray-600 mb-1">{data.user.email}</p>
              {data.user.phoneNumber && (
                <p className="text-gray-600 mb-4">{data.user.phoneNumber}</p>
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
                value="personal"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="professional"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Professional
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
              >
                Skills
              </TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={formData.personal.dateOfBirth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          dateOfBirth: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "personal"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nationality
                  </label>
                  <Input
                    value={formData.personal.nationality}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          nationality: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "personal"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
                    value={formData.personal.gender}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          gender: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "personal"}
                  >
                    <option value="" className="bg-background text-white">
                      Select Gender
                    </option>
                    <option value="Male" className="bg-background text-white">
                      Male
                    </option>
                    <option value="Female" className="bg-background text-white">
                      Female
                    </option>
                    <option value="Other" className="bg-background text-white">
                      Other
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Marital Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
                    value={formData.personal.maritalStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        personal: {
                          ...formData.personal,
                          maritalStatus: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "personal"}
                  >
                    <option value="" className="bg-background text-white">
                      Select Status
                    </option>
                    <option value="Single" className="bg-background text-white">
                      Single
                    </option>
                    <option
                      value="Married"
                      className="bg-background text-white"
                    >
                      Married
                    </option>
                    <option
                      value="Divorced"
                      className="bg-background text-white"
                    >
                      Divorced
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mailing Address
                </label>
                <Input
                  value={formData.personal.mailingAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: {
                        ...formData.personal,
                        mailingAddress: e.target.value,
                      },
                    })
                  }
                  disabled={savingTab === "personal"}
                />
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

            {/* Professional Info Tab */}
            <TabsContent value="professional" className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date of Joining
                  </label>
                  <Input
                    type="date"
                    value={formData.professional.dateOfJoining}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professional: {
                          ...formData.professional,
                          dateOfJoining: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "professional"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department
                  </label>
                  <Input
                    value={formData.professional.department}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professional: {
                          ...formData.professional,
                          department: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "professional"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Designation
                  </label>
                  <Input
                    value={formData.professional.designation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professional: {
                          ...formData.professional,
                          designation: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "professional"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <Input
                    value={formData.professional.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professional: {
                          ...formData.professional,
                          location: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "professional"}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">About</label>
                <Textarea
                  value={formData.professional.about}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      professional: {
                        ...formData.professional,
                        about: e.target.value,
                      },
                    })
                  }
                  disabled={savingTab === "professional"}
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Interests & Hobbies
                </label>
                <Textarea
                  value={formData.professional.interests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      professional: {
                        ...formData.professional,
                        interests: e.target.value,
                      },
                    })
                  }
                  disabled={savingTab === "professional"}
                  rows={3}
                />
              </div>
              <Button
                onClick={() => handleSaveTab("professional")}
                disabled={savingTab === "professional"}
              >
                {savingTab === "professional" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    PAN Number
                  </label>
                  <Input
                    value={formData.security.panNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          panNumber: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "security"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Aadhar Number
                  </label>
                  <Input
                    value={formData.security.aadharNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          aadharNumber: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "security"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bank Account Number
                  </label>
                  <Input
                    value={formData.security.accountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "security"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bank Name
                  </label>
                  <Input
                    value={formData.security.bankName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          bankName: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "security"}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    IFSC Code
                  </label>
                  <Input
                    value={formData.security.ifscCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        security: {
                          ...formData.security,
                          ifscCode: e.target.value,
                        },
                      })
                    }
                    disabled={savingTab === "security"}
                  />
                </div>
              </div>
              <Button
                onClick={() => handleSaveTab("security")}
                disabled={savingTab === "security"}
              >
                {savingTab === "security" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Add Skills</h3>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Enter skill and press Add"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    disabled={savingTab === "skills"}
                  />
                  <Button
                    onClick={handleAddSkill}
                    disabled={!skillInput.trim() || savingTab === "skills"}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill: string, i: number) => (
                    <div
                      key={i}
                      className="bg-background/10 text-blue-800/70 border-blue-700/20 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(i)}
                        disabled={savingTab === "skills"}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => handleSaveTab("skills")}
                disabled={savingTab === "skills"}
              >
                {savingTab === "skills" && (
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
