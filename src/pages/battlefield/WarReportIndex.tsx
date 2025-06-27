
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Trophy, TrendingUp, FileText, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Student Performance Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive analysis and reporting system for student academic performance tracking
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <BarChart3 className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-purple-800">Analytics</CardTitle>
              <CardDescription>Detailed performance metrics</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-blue-800">Student Management</CardTitle>
              <CardDescription>Comprehensive student profiles</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
              <CardTitle className="text-yellow-800">Rankings</CardTitle>
              <CardDescription>Performance leaderboards</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-green-800">Progress Tracking</CardTitle>
              <CardDescription>Monitor improvement over time</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Battle Analysis Card */}
          <Card className="border-purple-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl mb-2">Battle Analysis Report</CardTitle>
              <CardDescription className="text-purple-100">
                Interactive student performance dashboard with detailed chapter-wise analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Sticky student summary with key metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Subject-wise tabbed navigation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Interactive chapter performance cards
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    Inline editable feedback system
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <Link to="/battle-analysis">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    View Battle Analysis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* PTS Report Card */}
          <Card className="border-green-200 shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl mb-2">PTS Mock Test Report</CardTitle>
              <CardDescription className="text-green-100">
                Comprehensive mock test performance tracker with chapter-wise input
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Input correct/incorrect scores by chapter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Track time spent and marks per chapter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Note what went wrong and learning strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Real-time performance analysis and progress tracking
                  </li>
                </ul>
              </div>
              
              <div className="text-center">
                <Link to="/pts-report-card">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white">
                    <Target className="w-4 h-4 mr-2" />
                    Enter PTS Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Modern student performance tracking dashboard • Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
